package http

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"hosting-panel-agent/internal/config"
	"hosting-panel-agent/internal/metrics"
)

type Server struct {
	server         *http.Server
	metricsService metrics.Service
}

func NewServer(config config.HTTPConfig, metricsService metrics.Service) *Server {
	mux := http.NewServeMux()
	
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.Port),
		Handler: mux,
	}

	s := &Server{
		server:         server,
		metricsService: metricsService,
	}

	// Register routes
	mux.HandleFunc("/health", s.healthHandler)
	mux.HandleFunc("/metrics", s.metricsHandler)
	mux.HandleFunc("/", s.rootHandler)

	return s
}

func (s *Server) Start() error {
	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"status":"healthy","timestamp":"%s"}`, time.Now().Format(time.RFC3339))
}

func (s *Server) metricsHandler(w http.ResponseWriter, r *http.Request) {
	metrics, err := s.metricsService.GetSystemMetrics()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, `{"error":"%s"}`, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{
		"cpu_usage": %.2f,
		"memory_usage": %.2f,
		"disk_usage": %.2f,
		"bandwidth": %d,
		"uptime": %d,
		"timestamp": "%s"
	}`, metrics.CPUUsage, metrics.MemoryUsage, metrics.DiskUsage, metrics.Bandwidth, metrics.Uptime, time.Now().Format(time.RFC3339))
}

func (s *Server) rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `
		<html>
			<head>
				<title>Hosting Panel Agent</title>
			</head>
			<body>
				<h1>Hosting Panel Agent</h1>
				<p>Agent is running and healthy.</p>
				<ul>
					<li><a href="/health">Health Check</a></li>
					<li><a href="/metrics">Metrics</a></li>
				</ul>
			</body>
		</html>
	`)
}
