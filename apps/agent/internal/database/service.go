package database

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

type Service struct {
	mysql     MySQLConfig
	postgres  PostgreSQLConfig
}

type Config struct {
	MySQL     MySQLConfig
	PostgreSQL PostgreSQLConfig
}

type MySQLConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

type PostgreSQLConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

type DatabaseInfo struct {
	Name     string
	Type     string
	Size     int64
	Created  string
}

type UserInfo struct {
	Username string
	Host     string
	Privileges []string
}

func NewService(config Config) Service {
	return Service{
		mysql:    config.MySQL,
		postgres: config.PostgreSQL,
	}
}

func (s Service) CreateDatabase(name, username, password, dbType string) error {
	switch strings.ToLower(dbType) {
	case "mysql":
		return s.createMySQLDatabase(name, username, password)
	case "postgresql", "postgres":
		return s.createPostgreSQLDatabase(name, username, password)
	default:
		return fmt.Errorf("unsupported database type: %s", dbType)
	}
}

func (s Service) DeleteDatabase(name, dbType string) error {
	switch strings.ToLower(dbType) {
	case "mysql":
		return s.deleteMySQLDatabase(name)
	case "postgresql", "postgres":
		return s.deletePostgreSQLDatabase(name)
	default:
		return fmt.Errorf("unsupported database type: %s", dbType)
	}
}

func (s Service) createMySQLDatabase(name, username, password string) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", s.mysql.Username, s.mysql.Password, s.mysql.Host, s.mysql.Port)
	
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %v", err)
	}
	defer db.Close()

	// Create database
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", name))
	if err != nil {
		return fmt.Errorf("failed to create database: %v", err)
	}

	// Create user
	_, err = db.Exec(fmt.Sprintf("CREATE USER IF NOT EXISTS '%s'@'%%' IDENTIFIED BY '%s'", username, password))
	if err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	// Grant privileges
	_, err = db.Exec(fmt.Sprintf("GRANT ALL PRIVILEGES ON `%s`.* TO '%s'@'%%'", name, username))
	if err != nil {
		return fmt.Errorf("failed to grant privileges: %v", err)
	}

	_, err = db.Exec("FLUSH PRIVILEGES")
	if err != nil {
		return fmt.Errorf("failed to flush privileges: %v", err)
	}

	return nil
}

func (s Service) deleteMySQLDatabase(name string) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", s.mysql.Username, s.mysql.Password, s.mysql.Host, s.mysql.Port)
	
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %v", err)
	}
	defer db.Close()

	_, err = db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS `%s`", name))
	if err != nil {
		return fmt.Errorf("failed to delete database: %v", err)
	}

	return nil
}

func (s Service) createPostgreSQLDatabase(name, username, password string) error {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=postgres sslmode=disable",
		s.postgres.Host, s.postgres.Port, s.postgres.Username, s.postgres.Password)
	
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	// Create database
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", name))
	if err != nil {
		return fmt.Errorf("failed to create database: %v", err)
	}

	// Create user
	_, err = db.Exec(fmt.Sprintf("CREATE USER %s WITH PASSWORD '%s'", username, password))
	if err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	// Grant privileges
	_, err = db.Exec(fmt.Sprintf("GRANT ALL PRIVILEGES ON DATABASE %s TO %s", name, username))
	if err != nil {
		return fmt.Errorf("failed to grant privileges: %v", err)
	}

	return nil
}

func (s Service) deletePostgreSQLDatabase(name string) error {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=postgres sslmode=disable",
		s.postgres.Host, s.postgres.Port, s.postgres.Username, s.postgres.Password)
	
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	_, err = db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s", name))
	if err != nil {
		return fmt.Errorf("failed to delete database: %v", err)
	}

	return nil
}

func (s Service) ListDatabases(dbType string) ([]DatabaseInfo, error) {
	switch strings.ToLower(dbType) {
	case "mysql":
		return s.listMySQLDatabases()
	case "postgresql", "postgres":
		return s.listPostgreSQLDatabases()
	default:
		return nil, fmt.Errorf("unsupported database type: %s", dbType)
	}
}

func (s Service) listMySQLDatabases() ([]DatabaseInfo, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", s.mysql.Username, s.mysql.Password, s.mysql.Host, s.mysql.Port)
	
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MySQL: %v", err)
	}
	defer db.Close()

	rows, err := db.Query("SHOW DATABASES")
	if err != nil {
		return nil, fmt.Errorf("failed to query databases: %v", err)
	}
	defer rows.Close()

	var databases []DatabaseInfo
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			continue
		}
		
		// Skip system databases
		if name == "information_schema" || name == "mysql" || name == "performance_schema" || name == "sys" {
			continue
		}

		databases = append(databases, DatabaseInfo{
			Name: name,
			Type: "mysql",
		})
	}

	return databases, nil
}

func (s Service) listPostgreSQLDatabases() ([]DatabaseInfo, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=postgres sslmode=disable",
		s.postgres.Host, s.postgres.Port, s.postgres.Username, s.postgres.Password)
	
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT datname FROM pg_database WHERE datistemplate = false")
	if err != nil {
		return nil, fmt.Errorf("failed to query databases: %v", err)
	}
	defer rows.Close()

	var databases []DatabaseInfo
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			continue
		}
		
		// Skip system databases
		if name == "postgres" || name == "template0" || name == "template1" {
			continue
		}

		databases = append(databases, DatabaseInfo{
			Name: name,
			Type: "postgresql",
		})
	}

	return databases, nil
}
