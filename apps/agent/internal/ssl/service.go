package ssl

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

type Service struct {
	certPath     string
	keyPath      string
	letsEncrypt  LetsEncryptConfig
}

type Config struct {
	CertPath    string
	KeyPath     string
	LetsEncrypt LetsEncryptConfig
}

type LetsEncryptConfig struct {
	Email   string
	Staging bool
}

type CertificateInfo struct {
	Domain     string
	ExpiresAt  time.Time
	IsValid    bool
	IsExpired  bool
}

func NewService(config Config) Service {
	return Service{
		certPath:    config.CertPath,
		keyPath:     config.KeyPath,
		letsEncrypt: config.LetsEncrypt,
	}
}

func (s Service) EnableSSL(domain, cert, key string) error {
	// Save certificate and key files
	certFile := filepath.Join(s.certPath, fmt.Sprintf("%s.crt", domain))
	keyFile := filepath.Join(s.keyPath, fmt.Sprintf("%s.key", domain))

	if err := os.WriteFile(certFile, []byte(cert), 0644); err != nil {
		return fmt.Errorf("failed to save certificate: %v", err)
	}

	if err := os.WriteFile(keyFile, []byte(key), 0600); err != nil {
		return fmt.Errorf("failed to save private key: %v", err)
	}

	return nil
}

func (s Service) DisableSSL(domain string) error {
	// Remove certificate and key files
	certFile := filepath.Join(s.certPath, fmt.Sprintf("%s.crt", domain))
	keyFile := filepath.Join(s.keyPath, fmt.Sprintf("%s.key", domain))

	os.Remove(certFile)
	os.Remove(keyFile)

	return nil
}

func (s Service) GetCertificateInfo(domain string) (*CertificateInfo, error) {
	certFile := filepath.Join(s.certPath, fmt.Sprintf("%s.crt", domain))
	
	data, err := os.ReadFile(certFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read certificate: %v", err)
	}

	block, _ := pem.Decode(data)
	if block == nil {
		return nil, fmt.Errorf("failed to decode certificate")
	}

	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse certificate: %v", err)
	}

	now := time.Now()
	info := &CertificateInfo{
		Domain:    domain,
		ExpiresAt: cert.NotAfter,
		IsValid:   cert.NotAfter.After(now),
		IsExpired: cert.NotAfter.Before(now),
	}

	return info, nil
}

func (s Service) RequestLetsEncryptCertificate(domain string) error {
	// This would integrate with certbot or similar tool
	// For now, return an error indicating it's not implemented
	return fmt.Errorf("Let's Encrypt integration not implemented")
}

func (s Service) RenewCertificate(domain string) error {
	// This would check if renewal is needed and perform it
	// For now, return an error indicating it's not implemented
	return fmt.Errorf("certificate renewal not implemented")
}

func (s Service) ValidateCertificate(cert, key string) error {
	// Validate that the certificate and key match
	_, err := tls.X509KeyPair([]byte(cert), []byte(key))
	if err != nil {
		return fmt.Errorf("certificate and key do not match: %v", err)
	}

	return nil
}
