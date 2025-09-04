#!/bin/bash

# Hosting Control Panel Installation Script
# This script installs the hosting control panel on Ubuntu 20.04/22.04 and Debian 11/12

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/hosting-panel"
REPO_URL="https://github.com/your-org/hosting-control-panel.git"
ADMIN_EMAIL="admin@local"
ADMIN_PASSWORD="ChangeMe!"

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
    fi
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check OS
    if [[ ! -f /etc/os-release ]]; then
        error "Cannot determine OS version"
    fi
    
    source /etc/os-release
    case $ID in
        ubuntu)
            if [[ $VERSION_ID != "20.04" && $VERSION_ID != "22.04" ]]; then
                warn "Ubuntu $VERSION_ID detected. This script is tested on Ubuntu 20.04/22.04"
            fi
            ;;
        debian)
            if [[ $VERSION_ID != "11" && $VERSION_ID != "12" ]]; then
                warn "Debian $VERSION_ID detected. This script is tested on Debian 11/12"
            fi
            ;;
        *)
            error "Unsupported OS: $ID $VERSION_ID"
            ;;
    esac
    
    # Check memory
    MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $MEMORY_GB -lt 2 ]]; then
        error "Minimum 2GB RAM required. Found: ${MEMORY_GB}GB"
    fi
    
    # Check disk space
    DISK_GB=$(df / | awk 'NR==2{print int($4/1024/1024)}')
    if [[ $DISK_GB -lt 10 ]]; then
        error "Minimum 10GB disk space required. Found: ${DISK_GB}GB"
    fi
    
    log "System requirements check passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Update package list
    apt-get update
    
    # Install required packages
    apt-get install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        
        # Start and enable Docker
        systemctl start docker
        systemctl enable docker
    else
        log "Docker is already installed"
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    else
        log "Docker Compose is already installed"
    fi
    
    log "Dependencies installed successfully"
}

# Clone repository
clone_repository() {
    log "Cloning repository..."
    
    if [[ -d $INSTALL_DIR ]]; then
        warn "Installation directory already exists. Removing..."
        rm -rf $INSTALL_DIR
    fi
    
    git clone $REPO_URL $INSTALL_DIR
    cd $INSTALL_DIR
    
    log "Repository cloned successfully"
}

# Generate SSL certificates
generate_ssl_certificates() {
    log "Generating SSL certificates..."
    
    mkdir -p $INSTALL_DIR/certs
    
    # Generate self-signed certificate for development
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $INSTALL_DIR/certs/key.pem \
        -out $INSTALL_DIR/certs/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    
    log "SSL certificates generated"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Copy environment file
    cp env.example .env
    
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    
    # Update environment variables
    sed -i "s|APP_URL=http://localhost:3000|APP_URL=https://$SERVER_IP|g" .env
    sed -i "s|POSTGRES_PASSWORD=password|POSTGRES_PASSWORD=$(openssl rand -base64 32)|g" .env
    sed -i "s|JWT_SECRET=your-super-secret-jwt-key-change-this-in-production|JWT_SECRET=$(openssl rand -base64 64)|g" .env
    sed -i "s|MEILISEARCH_API_KEY=your-meilisearch-key|MEILISEARCH_API_KEY=$(openssl rand -base64 32)|g" .env
    
    log "Environment configured"
}

# Start services
start_services() {
    log "Starting services..."
    
    # Build and start containers
    docker-compose up -d --build
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        error "Failed to start services"
    fi
    
    log "Services started successfully"
}

# Create admin user
create_admin_user() {
    log "Creating admin user..."
    
    # Wait for database to be ready
    sleep 10
    
    # Create admin user
    docker-compose exec control-plane npm run create-admin -- --email $ADMIN_EMAIL --password $ADMIN_PASSWORD
    
    log "Admin user created successfully"
}

# Display installation summary
display_summary() {
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Hosting Control Panel Installed!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo -e "  Client Portal: https://$SERVER_IP"
    echo -e "  Helpdesk:      https://$SERVER_IP/helpdesk"
    echo -e "  API Docs:      https://$SERVER_IP/api/docs"
    echo ""
    echo -e "${BLUE}Admin Credentials:${NC}"
    echo -e "  Email:    $ADMIN_EMAIL"
    echo -e "  Password: $ADMIN_PASSWORD"
    echo ""
    echo -e "${YELLOW}Important:${NC}"
    echo -e "  - Change the admin password after first login"
    echo -e "  - Update SSL certificates for production use"
    echo -e "  - Configure your domain name in the settings"
    echo ""
    echo -e "${BLUE}Management Commands:${NC}"
    echo -e "  View logs:     docker-compose logs -f"
    echo -e "  Stop services: docker-compose down"
    echo -e "  Start services: docker-compose up -d"
    echo -e "  Upgrade:       ./upgrade.sh"
    echo -e "  Uninstall:     ./uninstall.sh"
    echo ""
}

# Main installation function
main() {
    log "Starting Hosting Control Panel installation..."
    
    check_root
    check_requirements
    install_dependencies
    clone_repository
    generate_ssl_certificates
    setup_environment
    start_services
    create_admin_user
    display_summary
    
    log "Installation completed successfully!"
}

# Run main function
main "$@"
