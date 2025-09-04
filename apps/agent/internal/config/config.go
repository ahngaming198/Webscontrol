package config

import (
	"os"
	"gopkg.in/yaml.v3"
)

type Config struct {
	GRPC    GRPCConfig    `yaml:"grpc"`
	HTTP    HTTPConfig    `yaml:"http"`
	Nginx   NginxConfig   `yaml:"nginx"`
	SSL     SSLConfig     `yaml:"ssl"`
	Database DatabaseConfig `yaml:"database"`
	Backup  BackupConfig  `yaml:"backup"`
	Logging LoggingConfig `yaml:"logging"`
}

type GRPCConfig struct {
	Port int    `yaml:"port"`
	Host string `yaml:"host"`
	TLS  TLSConfig `yaml:"tls"`
}

type HTTPConfig struct {
	Port int `yaml:"port"`
}

type TLSConfig struct {
	Enabled  bool   `yaml:"enabled"`
	CertFile string `yaml:"cert_file"`
	KeyFile  string `yaml:"key_file"`
	CAFile   string `yaml:"ca_file"`
}

type NginxConfig struct {
	ConfigPath    string `yaml:"config_path"`
	SitesPath     string `yaml:"sites_path"`
	ReloadCommand string `yaml:"reload_command"`
}

type SSLConfig struct {
	CertPath     string `yaml:"cert_path"`
	KeyPath      string `yaml:"key_path"`
	LetsEncrypt  LetsEncryptConfig `yaml:"letsencrypt"`
}

type LetsEncryptConfig struct {
	Email   string `yaml:"email"`
	Staging bool   `yaml:"staging"`
}

type DatabaseConfig struct {
	MySQL     MySQLConfig     `yaml:"mysql"`
	PostgreSQL PostgreSQLConfig `yaml:"postgresql"`
}

type MySQLConfig struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
}

type PostgreSQLConfig struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
}

type BackupConfig struct {
	StoragePath string `yaml:"storage_path"`
	S3          S3Config `yaml:"s3"`
}

type S3Config struct {
	Endpoint  string `yaml:"endpoint"`
	Bucket    string `yaml:"bucket"`
	AccessKey string `yaml:"access_key"`
	SecretKey string `yaml:"secret_key"`
	Region    string `yaml:"region"`
}

type LoggingConfig struct {
	Level  string `yaml:"level"`
	Format string `yaml:"format"`
}

func Load(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	// Set defaults
	if config.GRPC.Port == 0 {
		config.GRPC.Port = 50051
	}
	if config.HTTP.Port == 0 {
		config.HTTP.Port = 8080
	}
	if config.Nginx.ConfigPath == "" {
		config.Nginx.ConfigPath = "/etc/nginx"
	}
	if config.Nginx.SitesPath == "" {
		config.Nginx.SitesPath = "/etc/nginx/sites-available"
	}
	if config.Nginx.ReloadCommand == "" {
		config.Nginx.ReloadCommand = "nginx -s reload"
	}
	if config.SSL.CertPath == "" {
		config.SSL.CertPath = "/etc/ssl/certs"
	}
	if config.SSL.KeyPath == "" {
		config.SSL.KeyPath = "/etc/ssl/private"
	}
	if config.Backup.StoragePath == "" {
		config.Backup.StoragePath = "/var/backups"
	}
	if config.Logging.Level == "" {
		config.Logging.Level = "info"
	}
	if config.Logging.Format == "" {
		config.Logging.Format = "json"
	}

	return &config, nil
}
