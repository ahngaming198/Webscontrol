package backup

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type Service struct {
	storagePath string
	s3Config    S3Config
}

type Config struct {
	StoragePath string
	S3          S3Config
}

type S3Config struct {
	Endpoint  string
	Bucket    string
	AccessKey string
	SecretKey string
	Region    string
}

type BackupInfo struct {
	Name      string
	Path      string
	Size      int64
	CreatedAt int64
}

func NewService(config Config) Service {
	return Service{
		storagePath: config.StoragePath,
		s3Config:    config.S3,
	}
}

func (s Service) CreateBackup(name, backupType, sourcePath string) (string, error) {
	// Create backup filename with timestamp
	timestamp := time.Now().Format("2006-01-02-15-04-05")
	filename := fmt.Sprintf("%s-%s-%s.tar.gz", name, backupType, timestamp)
	backupPath := filepath.Join(s.storagePath, filename)

	// Create backup directory if it doesn't exist
	if err := os.MkdirAll(s.storagePath, 0755); err != nil {
		return "", fmt.Errorf("failed to create backup directory: %v", err)
	}

	// Create the backup file
	file, err := os.Create(backupPath)
	if err != nil {
		return "", fmt.Errorf("failed to create backup file: %v", err)
	}
	defer file.Close()

	// Create gzip writer
	gzipWriter := gzip.NewWriter(file)
	defer gzipWriter.Close()

	// Create tar writer
	tarWriter := tar.NewWriter(gzipWriter)
	defer tarWriter.Close()

	// Add files to the archive
	err = s.addToArchive(tarWriter, sourcePath, "")
	if err != nil {
		return "", fmt.Errorf("failed to create archive: %v", err)
	}

	return backupPath, nil
}

func (s Service) RestoreBackup(backupPath, targetPath string) error {
	// Open the backup file
	file, err := os.Open(backupPath)
	if err != nil {
		return fmt.Errorf("failed to open backup file: %v", err)
	}
	defer file.Close()

	// Create gzip reader
	gzipReader, err := gzip.NewReader(file)
	if err != nil {
		return fmt.Errorf("failed to create gzip reader: %v", err)
	}
	defer gzipReader.Close()

	// Create tar reader
	tarReader := tar.NewReader(gzipReader)

	// Extract files
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("failed to read tar header: %v", err)
		}

		// Create target file path
		targetFile := filepath.Join(targetPath, header.Name)

		// Create directory if needed
		if header.Typeflag == tar.TypeDir {
			if err := os.MkdirAll(targetFile, 0755); err != nil {
				return fmt.Errorf("failed to create directory: %v", err)
			}
			continue
		}

		// Create parent directory
		if err := os.MkdirAll(filepath.Dir(targetFile), 0755); err != nil {
			return fmt.Errorf("failed to create parent directory: %v", err)
		}

		// Create file
		outFile, err := os.Create(targetFile)
		if err != nil {
			return fmt.Errorf("failed to create file: %v", err)
		}

		// Copy file content
		_, err = io.Copy(outFile, tarReader)
		outFile.Close()
		if err != nil {
			return fmt.Errorf("failed to copy file content: %v", err)
		}

		// Set file permissions
		if err := os.Chmod(targetFile, os.FileMode(header.Mode)); err != nil {
			return fmt.Errorf("failed to set file permissions: %v", err)
		}
	}

	return nil
}

func (s Service) ListBackups() ([]BackupInfo, error) {
	files, err := os.ReadDir(s.storagePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read backup directory: %v", err)
	}

	var backups []BackupInfo
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		if !strings.HasSuffix(file.Name(), ".tar.gz") {
			continue
		}

		info, err := file.Info()
		if err != nil {
			continue
		}

		backups = append(backups, BackupInfo{
			Name:      file.Name(),
			Path:      filepath.Join(s.storagePath, file.Name()),
			Size:      info.Size(),
			CreatedAt: info.ModTime().Unix(),
		})
	}

	return backups, nil
}

func (s Service) UploadToS3(backupPath, s3Key string) error {
	// Create AWS session
	sess, err := session.NewSession(&aws.Config{
		Endpoint:    aws.String(s.s3Config.Endpoint),
		Region:      aws.String(s.s3Config.Region),
		Credentials: credentials.NewStaticCredentials(s.s3Config.AccessKey, s.s3Config.SecretKey, ""),
	})
	if err != nil {
		return fmt.Errorf("failed to create AWS session: %v", err)
	}

	// Create S3 service
	svc := s3.New(sess)

	// Open backup file
	file, err := os.Open(backupPath)
	if err != nil {
		return fmt.Errorf("failed to open backup file: %v", err)
	}
	defer file.Close()

	// Upload to S3
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(s.s3Config.Bucket),
		Key:    aws.String(s3Key),
		Body:   file,
	})
	if err != nil {
		return fmt.Errorf("failed to upload to S3: %v", err)
	}

	return nil
}

func (s Service) DownloadFromS3(s3Key, localPath string) error {
	// Create AWS session
	sess, err := session.NewSession(&aws.Config{
		Endpoint:    aws.String(s.s3Config.Endpoint),
		Region:      aws.String(s.s3Config.Region),
		Credentials: credentials.NewStaticCredentials(s.s3Config.AccessKey, s.s3Config.SecretKey, ""),
	})
	if err != nil {
		return fmt.Errorf("failed to create AWS session: %v", err)
	}

	// Create S3 service
	svc := s3.New(sess)

	// Download from S3
	result, err := svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(s.s3Config.Bucket),
		Key:    aws.String(s3Key),
	})
	if err != nil {
		return fmt.Errorf("failed to download from S3: %v", err)
	}
	defer result.Body.Close()

	// Create local file
	file, err := os.Create(localPath)
	if err != nil {
		return fmt.Errorf("failed to create local file: %v", err)
	}
	defer file.Close()

	// Copy content
	_, err = io.Copy(file, result.Body)
	if err != nil {
		return fmt.Errorf("failed to copy content: %v", err)
	}

	return nil
}

func (s Service) addToArchive(tarWriter *tar.Writer, sourcePath, basePath string) error {
	return filepath.Walk(sourcePath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Create tar header
		header, err := tar.FileInfoHeader(info, "")
		if err != nil {
			return err
		}

		// Update header name
		relPath, err := filepath.Rel(sourcePath, path)
		if err != nil {
			return err
		}
		header.Name = filepath.Join(basePath, relPath)

		// Write header
		if err := tarWriter.WriteHeader(header); err != nil {
			return err
		}

		// Write file content if it's a regular file
		if info.Mode().IsRegular() {
			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()

			_, err = io.Copy(tarWriter, file)
			if err != nil {
				return err
			}
		}

		return nil
	})
}
