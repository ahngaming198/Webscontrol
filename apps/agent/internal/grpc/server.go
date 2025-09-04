package grpc

import (
	"context"
	"log"

	"hosting-panel-agent/internal/backup"
	"hosting-panel-agent/internal/database"
	"hosting-panel-agent/internal/metrics"
	"hosting-panel-agent/internal/nginx"
	"hosting-panel-agent/internal/ssl"
	pb "hosting-panel-agent/proto"

	"google.golang.org/grpc"
)

type AgentServer struct {
	pb.UnimplementedAgentServiceServer
	nginxService   nginx.Service
	sslService     ssl.Service
	dbService      database.Service
	backupService  backup.Service
	metricsService metrics.Service
}

func NewAgentServer(
	nginxService nginx.Service,
	sslService ssl.Service,
	dbService database.Service,
	backupService backup.Service,
	metricsService metrics.Service,
) *AgentServer {
	return &AgentServer{
		nginxService:   nginxService,
		sslService:     sslService,
		dbService:      dbService,
		backupService:  backupService,
		metricsService: metricsService,
	}
}

func (s *AgentServer) Register(grpcServer *grpc.Server) {
	pb.RegisterAgentServiceServer(grpcServer, s)
}

func (s *AgentServer) HealthCheck(ctx context.Context, req *pb.HealthCheckRequest) (*pb.HealthCheckResponse, error) {
	return &pb.HealthCheckResponse{
		Healthy: true,
		Message: "Agent is healthy",
	}, nil
}

func (s *AgentServer) GetMetrics(ctx context.Context, req *pb.GetMetricsRequest) (*pb.GetMetricsResponse, error) {
	metrics, err := s.metricsService.GetSystemMetrics()
	if err != nil {
		log.Printf("Error getting metrics: %v", err)
		return &pb.GetMetricsResponse{}, err
	}

	return &pb.GetMetricsResponse{
		Metrics: &pb.SystemMetrics{
			CpuUsage:    metrics.CPUUsage,
			MemoryUsage: metrics.MemoryUsage,
			DiskUsage:   metrics.DiskUsage,
			Bandwidth:   metrics.Bandwidth,
			Uptime:      metrics.Uptime,
		},
	}, nil
}

func (s *AgentServer) CreateSite(ctx context.Context, req *pb.CreateSiteRequest) (*pb.CreateSiteResponse, error) {
	err := s.nginxService.CreateSite(req.Domain, req.DocumentRoot, req.PhpVersion, req.NodeVersion)
	if err != nil {
		log.Printf("Error creating site: %v", err)
		return &pb.CreateSiteResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.CreateSiteResponse{
		Success: true,
		Message: "Site created successfully",
	}, nil
}

func (s *AgentServer) DeleteSite(ctx context.Context, req *pb.DeleteSiteRequest) (*pb.DeleteSiteResponse, error) {
	err := s.nginxService.DeleteSite(req.Domain)
	if err != nil {
		log.Printf("Error deleting site: %v", err)
		return &pb.DeleteSiteResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.DeleteSiteResponse{
		Success: true,
		Message: "Site deleted successfully",
	}, nil
}

func (s *AgentServer) EnableSSL(ctx context.Context, req *pb.EnableSSLRequest) (*pb.EnableSSLResponse, error) {
	err := s.sslService.EnableSSL(req.Domain, req.Cert, req.Key)
	if err != nil {
		log.Printf("Error enabling SSL: %v", err)
		return &pb.EnableSSLResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.EnableSSLResponse{
		Success: true,
		Message: "SSL enabled successfully",
	}, nil
}

func (s *AgentServer) DisableSSL(ctx context.Context, req *pb.DisableSSLRequest) (*pb.DisableSSLResponse, error) {
	err := s.sslService.DisableSSL(req.Domain)
	if err != nil {
		log.Printf("Error disabling SSL: %v", err)
		return &pb.DisableSSLResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.DisableSSLResponse{
		Success: true,
		Message: "SSL disabled successfully",
	}, nil
}

func (s *AgentServer) CreateDatabase(ctx context.Context, req *pb.CreateDatabaseRequest) (*pb.CreateDatabaseResponse, error) {
	err := s.dbService.CreateDatabase(req.Name, req.Username, req.Password, req.Type)
	if err != nil {
		log.Printf("Error creating database: %v", err)
		return &pb.CreateDatabaseResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.CreateDatabaseResponse{
		Success: true,
		Message: "Database created successfully",
	}, nil
}

func (s *AgentServer) DeleteDatabase(ctx context.Context, req *pb.DeleteDatabaseRequest) (*pb.DeleteDatabaseResponse, error) {
	err := s.dbService.DeleteDatabase(req.Name, req.Type)
	if err != nil {
		log.Printf("Error deleting database: %v", err)
		return &pb.DeleteDatabaseResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.DeleteDatabaseResponse{
		Success: true,
		Message: "Database deleted successfully",
	}, nil
}

func (s *AgentServer) CreateBackup(ctx context.Context, req *pb.CreateBackupRequest) (*pb.CreateBackupResponse, error) {
	backupPath, err := s.backupService.CreateBackup(req.Name, req.Type, req.Path)
	if err != nil {
		log.Printf("Error creating backup: %v", err)
		return &pb.CreateBackupResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.CreateBackupResponse{
		Success:    true,
		Message:    "Backup created successfully",
		BackupPath: backupPath,
	}, nil
}

func (s *AgentServer) RestoreBackup(ctx context.Context, req *pb.RestoreBackupRequest) (*pb.RestoreBackupResponse, error) {
	err := s.backupService.RestoreBackup(req.BackupPath, req.TargetPath)
	if err != nil {
		log.Printf("Error restoring backup: %v", err)
		return &pb.RestoreBackupResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &pb.RestoreBackupResponse{
		Success: true,
		Message: "Backup restored successfully",
	}, nil
}

func (s *AgentServer) ListBackups(ctx context.Context, req *pb.ListBackupsRequest) (*pb.ListBackupsResponse, error) {
	backups, err := s.backupService.ListBackups()
	if err != nil {
		log.Printf("Error listing backups: %v", err)
		return &pb.ListBackupsResponse{}, err
	}

	var backupInfos []*pb.BackupInfo
	for _, backup := range backups {
		backupInfos = append(backupInfos, &pb.BackupInfo{
			Name:      backup.Name,
			Path:      backup.Path,
			Size:      backup.Size,
			CreatedAt: backup.CreatedAt,
		})
	}

	return &pb.ListBackupsResponse{
		Backups: backupInfos,
	}, nil
}
