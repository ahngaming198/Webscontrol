#!/bin/bash

# Hosting Control Panel Uninstall Script
# This script completely removes the hosting control panel

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
}

# Confirm uninstallation
confirm_uninstall() {
    echo -e "${YELLOW}This will completely remove the Hosting Control Panel and all data.${NC}"
    echo -e "${YELLOW}This action cannot be undone!${NC}"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "Uninstallation cancelled"
        exit 0
    fi
}

# Stop and remove containers
stop_services() {
    log "Stopping services..."
    
    cd $INSTALL_DIR
    
    if [[ -f docker-compose.yml ]]; then
        docker-compose down
        log "Services stopped"
    else
        warn "docker-compose.yml not found, skipping service stop"
    fi
}

# Remove Docker images
remove_images() {
    log "Removing Docker images..."
    
    # Remove images built by this project
    docker images | grep hosting-panel | awk '{print $3}' | xargs -r docker rmi -f
    
    log "Docker images removed"
}

# Remove Docker volumes
remove_volumes() {
    log "Removing Docker volumes..."
    
    # Remove volumes created by this project
    docker volume ls | grep hosting-panel | awk '{print $2}' | xargs -r docker volume rm
    
    log "Docker volumes removed"
}

# Remove installation directory
remove_directory() {
    log "Removing installation directory..."
    
    rm -rf $INSTALL_DIR
    
    log "Installation directory removed"
}

# Remove systemd service (if exists)
remove_systemd_service() {
    if [[ -f /etc/systemd/system/hosting-panel.service ]]; then
        log "Removing systemd service..."
        systemctl stop hosting-panel
        systemctl disable hosting-panel
        rm /etc/systemd/system/hosting-panel.service
        systemctl daemon-reload
        log "Systemd service removed"
    fi
}

# Clean up Docker
cleanup_docker() {
    log "Cleaning up Docker..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log "Docker cleanup completed"
}

# Display uninstall summary
display_summary() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Hosting Control Panel Uninstalled!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}What was removed:${NC}"
    echo -e "  - All Docker containers and images"
    echo -e "  - All Docker volumes (including database data)"
    echo -e "  - Installation directory: $INSTALL_DIR"
    echo -e "  - Systemd service (if existed)"
    echo ""
    echo -e "${YELLOW}Note:${NC}"
    echo -e "  - Docker and Docker Compose are still installed"
    echo -e "  - You can reinstall anytime using install.sh"
    echo ""
}

# Main uninstall function
main() {
    log "Starting Hosting Control Panel uninstallation..."
    
    check_root
    check_installation
    confirm_uninstall
    stop_services
    remove_images
    remove_volumes
    remove_directory
    remove_systemd_service
    cleanup_docker
    display_summary
    
    log "Uninstallation completed successfully!"
}

# Run main function
main "$@"
