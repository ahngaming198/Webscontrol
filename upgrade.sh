#!/bin/bash

# Hosting Control Panel Upgrade Script
# This script upgrades the hosting control panel to the latest version

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/hosting-panel"

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

# Check if installation exists
check_installation() {
    if [[ ! -d $INSTALL_DIR ]]; then
        error "Hosting Control Panel is not installed at $INSTALL_DIR"
    fi
    
    if [[ ! -f $INSTALL_DIR/docker-compose.yml ]]; then
        error "Invalid installation directory"
    fi
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    BACKUP_DIR="/opt/hosting-panel-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup environment file
    cp $INSTALL_DIR/.env $BACKUP_DIR/
    
    # Backup SSL certificates
    if [[ -d $INSTALL_DIR/certs ]]; then
        cp -r $INSTALL_DIR/certs $BACKUP_DIR/
    fi
    
    # Backup custom configurations
    if [[ -f $INSTALL_DIR/nginx.conf ]]; then
        cp $INSTALL_DIR/nginx.conf $BACKUP_DIR/
    fi
    
    log "Backup created at $BACKUP_DIR"
}

# Pull latest changes
pull_latest() {
    log "Pulling latest changes..."
    
    cd $INSTALL_DIR
    
    # Stash any local changes
    git stash
    
    # Pull latest changes
    git pull origin main
    
    log "Latest changes pulled successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    cd $INSTALL_DIR
    
    # Run Prisma migrations
    docker-compose exec control-plane npx prisma migrate deploy
    
    log "Database migrations completed"
}

# Rebuild and restart services
restart_services() {
    log "Rebuilding and restarting services..."
    
    cd $INSTALL_DIR
    
    # Stop services
    docker-compose down
    
    # Rebuild images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        error "Failed to restart services"
    fi
    
    log "Services restarted successfully"
}

# Clean up old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    log "Cleanup completed"
}

# Display upgrade summary
display_summary() {
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Hosting Control Panel Upgraded!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo -e "  Client Portal: https://$SERVER_IP"
    echo -e "  Helpdesk:      https://$SERVER_IP/helpdesk"
    echo -e "  API Docs:      https://$SERVER_IP/api/docs"
    echo ""
    echo -e "${BLUE}Management Commands:${NC}"
    echo -e "  View logs:     docker-compose logs -f"
    echo -e "  Stop services: docker-compose down"
    echo -e "  Start services: docker-compose up -d"
    echo ""
}

# Main upgrade function
main() {
    log "Starting Hosting Control Panel upgrade..."
    
    check_root
    check_installation
    create_backup
    pull_latest
    run_migrations
    restart_services
    cleanup
    display_summary
    
    log "Upgrade completed successfully!"
}

# Run main function
main "$@"
