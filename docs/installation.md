# Installation Guide

This guide provides detailed instructions for installing the Hosting Control Panel on various operating systems.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Post-Installation](#post-installation)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **OS**: Ubuntu 20.04/22.04 or Debian 11/12
- **CPU**: 1 core
- **RAM**: 2GB
- **Disk**: 10GB
- **Network**: Internet connection

### Recommended Requirements

- **OS**: Ubuntu 22.04 LTS
- **CPU**: 2+ cores
- **RAM**: 4GB+
- **Disk**: 20GB+ SSD
- **Network**: Static IP address

### Supported Operating Systems

- Ubuntu 20.04 LTS
- Ubuntu 22.04 LTS
- Debian 11 (Bullseye)
- Debian 12 (Bookworm)

## Quick Installation

The fastest way to install the Hosting Control Panel is using our automated installation script:

```bash
curl -fsSL https://raw.githubusercontent.com/your-org/hosting-control-panel/main/install.sh | sudo bash
```

This script will:
- Check system requirements
- Install Docker and Docker Compose
- Clone the repository
- Generate SSL certificates
- Configure the environment
- Start all services
- Create an admin user

## Manual Installation

### Step 1: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
```

### Step 3: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 4: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/hosting-control-panel.git
cd hosting-control-panel

# Make scripts executable
chmod +x install.sh upgrade.sh uninstall.sh
```

### Step 5: Configure Environment

```bash
# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

Key environment variables to configure:

```bash
# Application
APP_NAME="Hosting Control Panel"
APP_URL=https://your-domain.com
APP_ENV=production

# Database
POSTGRES_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# S3 Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=hosting-panel-backups
```

### Step 6: Generate SSL Certificates

```bash
# Create certificates directory
mkdir -p certs

# Generate self-signed certificate for development
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout certs/key.pem \
    -out certs/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

### Step 7: Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps
```

### Step 8: Create Admin User

```bash
# Wait for services to start
sleep 30

# Create admin user
docker-compose exec control-plane npm run create-admin -- --email admin@example.com --password your-password
```

## Configuration

### SSL Certificates

#### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./certs/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./certs/key.pem

# Set proper permissions
sudo chown $USER:$USER ./certs/cert.pem ./certs/key.pem
```

#### Using Custom Certificates

```bash
# Copy your certificates
cp your-certificate.pem ./certs/cert.pem
cp your-private-key.pem ./certs/key.pem

# Set proper permissions
chmod 644 ./certs/cert.pem
chmod 600 ./certs/key.pem
```

### Nginx Configuration

Edit `nginx.conf` to configure your domain:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    # Your configuration here
}
```

### Database Configuration

The system uses PostgreSQL by default. To configure:

```bash
# Edit database settings in .env
DATABASE_URL=postgresql://postgres:your-password@postgres:5432/hosting_panel
```

### Email Configuration

Configure SMTP settings for email notifications:

```bash
# Gmail example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com
```

### S3 Storage Configuration

Configure S3-compatible storage for backups:

```bash
# AWS S3 example
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=hosting-panel-backups
AWS_S3_ENDPOINT=https://s3.amazonaws.com
```

## Post-Installation

### 1. Verify Installation

```bash
# Check all services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test API
curl -k https://localhost/api/health
```

### 2. Access the Control Panel

- **Client Portal**: `https://your-domain.com`
- **Helpdesk**: `https://your-domain.com/helpdesk`
- **API Documentation**: `https://your-domain.com/api/docs`

### 3. Initial Configuration

1. **Login with admin credentials**
2. **Change default password**
3. **Configure your organization**
4. **Set up your first site**
5. **Configure SSL certificates**
6. **Set up backups**

### 4. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Update system
sudo apt update && sudo apt upgrade -y

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. Set Up Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Set up log rotation
sudo nano /etc/logrotate.d/hosting-panel
```

## Troubleshooting

### Common Issues

#### Services Not Starting

```bash
# Check Docker status
sudo systemctl status docker

# Check service logs
docker-compose logs control-plane
docker-compose logs postgres
docker-compose logs redis
```

#### Database Connection Issues

```bash
# Check database status
docker-compose exec postgres psql -U postgres -c "SELECT version();"

# Check database logs
docker-compose logs postgres
```

#### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in certs/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

#### Port Conflicts

```bash
# Check what's using ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000
```

### Log Files

```bash
# Application logs
docker-compose logs -f control-plane
docker-compose logs -f client-portal
docker-compose logs -f helpdesk

# System logs
sudo journalctl -u docker
sudo journalctl -u nginx
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check disk usage
df -h
du -sh /var/lib/docker

# Check memory usage
free -h
```

### Network Issues

```bash
# Test connectivity
ping google.com
nslookup your-domain.com

# Check DNS
dig your-domain.com
```

## Uninstallation

To completely remove the Hosting Control Panel:

```bash
# Run uninstall script
./uninstall.sh

# Or manually
docker-compose down
docker system prune -a
sudo rm -rf /opt/hosting-panel
```

## Support

If you encounter issues during installation:

1. **Check the logs**: `docker-compose logs -f`
2. **Verify system requirements**: Ensure your system meets the minimum requirements
3. **Check network connectivity**: Ensure your server can access the internet
4. **Review configuration**: Verify all environment variables are set correctly
5. **Contact support**: Submit an issue on GitHub or contact our support team

---

**Next Steps**: After successful installation, proceed to the [Getting Started Guide](getting-started.md) to configure your first site and database.
