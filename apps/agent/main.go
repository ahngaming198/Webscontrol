package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"hosting-panel-agent/internal/config"
	"hosting-panel-agent/internal/grpc"
	"hosting-panel-agent/internal/http"
	"hosting-panel-agent/internal/nginx"
	"hosting-panel-agent/internal/ssl"
	"hosting-panel-agent/internal/database"
	"hosting-panel-agent/internal/backup"
	"hosting-panel-agent/internal/metrics"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/reflection"
)

func main() {
	var configPath = flag.String("config", "config.yaml", "Path to configuration file")
	flag.Parse()

	// Load configuration
	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize services
	nginxService := nginx.NewService(cfg.Nginx)
	sslService := ssl.NewService(cfg.SSL)
	dbService := database.NewService(cfg.Database)
	backupService := backup.NewService(cfg.Backup)
	metricsService := metrics.NewService()

	// Create gRPC server
	var grpcServer *grpc.Server
	if cfg.GRPC.TLS.Enabled {
		creds, err := credentials.NewServerTLSFromFile(cfg.GRPC.TLS.CertFile, cfg.GRPC.TLS.KeyFile)
		if err != nil {
			log.Fatalf("Failed to load TLS credentials: %v", err)
		}
		grpcServer = grpc.NewServer(grpc.Creds(creds))
	} else {
		grpcServer = grpc.NewServer()
	}

	// Register gRPC services
	agentServer := grpc.NewAgentServer(nginxService, sslService, dbService, backupService, metricsService)
	agentServer.Register(grpcServer)
	reflection.Register(grpcServer)

	// Start gRPC server
	grpcListener, err := net.Listen("tcp", fmt.Sprintf(":%d", cfg.GRPC.Port))
	if err != nil {
		log.Fatalf("Failed to listen on gRPC port: %v", err)
	}

	go func() {
		log.Printf("Starting gRPC server on port %d", cfg.GRPC.Port)
		if err := grpcServer.Serve(grpcListener); err != nil {
			log.Fatalf("Failed to serve gRPC: %v", err)
		}
	}()

	// Start HTTP server for health checks and metrics
	httpServer := http.NewServer(cfg.HTTP, metricsService)
	go func() {
		log.Printf("Starting HTTP server on port %d", cfg.HTTP.Port)
		if err := httpServer.Start(); err != nil {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	// Start metrics collection
	go metricsService.Start()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Stop gRPC server
	grpcServer.GracefulStop()

	// Stop HTTP server
	httpServer.Stop(ctx)

	log.Println("Server stopped")
}
