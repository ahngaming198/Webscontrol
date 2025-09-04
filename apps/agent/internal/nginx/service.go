package nginx

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
)

type Service struct {
	configPath    string
	sitesPath     string
	reloadCommand string
}

type Config struct {
	ConfigPath    string
	SitesPath     string
	ReloadCommand string
}

type SiteConfig struct {
	Domain      string
	DocumentRoot string
	PHPVersion  string
	NodeVersion string
	SSLEnabled  bool
	SSLCert     string
	SSLKey      string
}

func NewService(config Config) Service {
	return Service{
		configPath:    config.ConfigPath,
		sitesPath:     config.SitesPath,
		reloadCommand: config.ReloadCommand,
	}
}

func (s Service) CreateSite(domain, documentRoot, phpVersion, nodeVersion string) error {
	// Create document root directory
	if err := os.MkdirAll(documentRoot, 0755); err != nil {
		return fmt.Errorf("failed to create document root: %v", err)
	}

	// Create nginx configuration
	config := SiteConfig{
		Domain:       domain,
		DocumentRoot: documentRoot,
		PHPVersion:   phpVersion,
		NodeVersion:  nodeVersion,
		SSLEnabled:   false,
	}

	configPath := filepath.Join(s.sitesPath, domain)
	if err := s.writeNginxConfig(configPath, config); err != nil {
		return fmt.Errorf("failed to write nginx config: %v", err)
	}

	// Enable site
	enabledPath := filepath.Join(s.configPath, "sites-enabled", domain)
	if err := os.Symlink(configPath, enabledPath); err != nil {
		return fmt.Errorf("failed to enable site: %v", err)
	}

	// Reload nginx
	return s.reloadNginx()
}

func (s Service) DeleteSite(domain string) error {
	// Remove enabled site
	enabledPath := filepath.Join(s.configPath, "sites-enabled", domain)
	if err := os.Remove(enabledPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to disable site: %v", err)
	}

	// Remove configuration file
	configPath := filepath.Join(s.sitesPath, domain)
	if err := os.Remove(configPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to remove config: %v", err)
	}

	// Reload nginx
	return s.reloadNginx()
}

func (s Service) EnableSSL(domain, cert, key string) error {
	configPath := filepath.Join(s.sitesPath, domain)
	
	// Read existing config
	config, err := s.readNginxConfig(configPath)
	if err != nil {
		return fmt.Errorf("failed to read config: %v", err)
	}

	// Update SSL settings
	config.SSLEnabled = true
	config.SSLCert = cert
	config.SSLKey = key

	// Write updated config
	if err := s.writeNginxConfig(configPath, config); err != nil {
		return fmt.Errorf("failed to update config: %v", err)
	}

	// Reload nginx
	return s.reloadNginx()
}

func (s Service) DisableSSL(domain string) error {
	configPath := filepath.Join(s.sitesPath, domain)
	
	// Read existing config
	config, err := s.readNginxConfig(configPath)
	if err != nil {
		return fmt.Errorf("failed to read config: %v", err)
	}

	// Update SSL settings
	config.SSLEnabled = false
	config.SSLCert = ""
	config.SSLKey = ""

	// Write updated config
	if err := s.writeNginxConfig(configPath, config); err != nil {
		return fmt.Errorf("failed to update config: %v", err)
	}

	// Reload nginx
	return s.reloadNginx()
}

func (s Service) writeNginxConfig(path string, config SiteConfig) error {
	tmpl := `server {
    listen 80;
    server_name {{.Domain}};
    root {{.DocumentRoot}};
    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    {{if .PHPVersion}}
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php{{.PHPVersion}}-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    {{end}}

    {{if .SSLEnabled}}
    listen 443 ssl;
    ssl_certificate {{.SSLCert}};
    ssl_certificate_key {{.SSLKey}};
    {{end}}
}`

	t, err := template.New("nginx").Parse(tmpl)
	if err != nil {
		return err
	}

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	return t.Execute(file, config)
}

func (s Service) readNginxConfig(path string) (SiteConfig, error) {
	// This is a simplified implementation
	// In a real implementation, you would parse the nginx config file
	return SiteConfig{}, fmt.Errorf("not implemented")
}

func (s Service) reloadNginx() error {
	cmd := exec.Command("sh", "-c", s.reloadCommand)
	return cmd.Run()
}
