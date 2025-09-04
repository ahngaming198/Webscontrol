# Hosting Control Panel

A comprehensive, open-source web hosting control panel with an open-core model (Community, Premium, Enterprise tiers). Built with modern technologies and designed for scalability, security, and ease of use.

## 🌟 Features

### Core Features (All Tiers)
- **Multi-tenant Architecture**: Support for multiple organizations and users
- **Site Management**: Create, configure, and manage websites with Nginx
- **Database Management**: MySQL and PostgreSQL database creation and management
- **SSL Certificate Management**: Let's Encrypt integration and custom SSL certificates
- **User Management**: Role-based access control (RBAC) with 4 user roles
- **Two-Factor Authentication**: Enhanced security with 2FA support
- **API Access**: RESTful API with comprehensive documentation

### Premium Features
- **Automated Backups**: Scheduled backups with S3 storage support
- **Multi-server Management**: Manage multiple servers from a single interface
- **Advanced Monitoring**: Real-time server metrics and performance monitoring
- **Wildcard SSL**: Support for wildcard SSL certificates
- **Priority Support**: Enhanced support ticket system

### Enterprise Features
- **White-label Solution**: Custom branding and domain
- **Custom Branding**: Fully customizable interface
- **Unlimited API Access**: No rate limits on API usage
- **Dedicated Support**: Direct access to support team
- **Custom Integrations**: Tailored integrations for your needs

## 🏗️ Architecture

The system is built using a microservices architecture with the following components:

- **Control Plane**: NestJS backend API with PostgreSQL and Prisma ORM
- **Client Portal**: Next.js 14 frontend with Tailwind CSS and shadcn/ui
- **Helpdesk System**: Next.js 14 knowledge base and ticket system
- **Agent**: Go-based server agent for VPS management
- **Database**: PostgreSQL for data persistence
- **Cache**: Redis for session management and caching
- **Search**: Meilisearch for knowledge base search functionality

## 🚀 Quick Start

### Prerequisites

- Ubuntu 20.04/22.04 or Debian 11/12
- Minimum 1 CPU core, 2GB RAM, 10GB disk space
- Root access to the server

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/hosting-control-panel.git
   cd hosting-control-panel
   ```

2. **Run the installation script**:
   ```bash
   chmod +x install.sh
   sudo ./install.sh
   ```

3. **Access the control panel**:
   - Client Portal: `https://your-server-ip`
   - Helpdesk: `https://your-server-ip/helpdesk`
   - API Documentation: `https://your-server-ip/api/docs`

4. **Default admin credentials**:
   - Email: `admin@local`
   - Password: `ChangeMe!`

### Manual Installation

If you prefer manual installation:

1. **Install Docker and Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the services**:
   ```bash
   docker-compose up -d --build
   ```

4. **Create admin user**:
   ```bash
   docker-compose exec control-plane npm run create-admin -- --email admin@example.com --password your-password
   ```

## 📖 Documentation

### User Guides
- [Getting Started Guide](docs/getting-started.md)
- [Site Management](docs/site-management.md)
- [Database Management](docs/database-management.md)
- [SSL Certificate Setup](docs/ssl-certificates.md)
- [Backup and Restore](docs/backup-restore.md)
- [API Documentation](docs/api-documentation.md)

### Administrator Guides
- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [Security Best Practices](docs/security.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Upgrade Guide](docs/upgrade.md)

### Developer Guides
- [Development Setup](docs/development.md)
- [Architecture Overview](docs/architecture.md)
- [Contributing Guidelines](docs/contributing.md)
- [API Reference](docs/api-reference.md)

## 🔧 Configuration

### Environment Variables

Key environment variables that can be configured:

```bash
# Application
APP_NAME="Hosting Control Panel"
APP_URL=https://your-domain.com
APP_ENV=production

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/hosting_panel

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# S3 Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=hosting-panel-backups

# Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com
LETSENCRYPT_STAGING=false
```

### SSL Certificates

For production use, replace the self-signed certificates with proper SSL certificates:

1. **Using Let's Encrypt**:
   ```bash
   certbot certonly --standalone -d your-domain.com
   cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./certs/cert.pem
   cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./certs/key.pem
   ```

2. **Using custom certificates**:
   ```bash
   cp your-certificate.pem ./certs/cert.pem
   cp your-private-key.pem ./certs/key.pem
   ```

## 🔐 Security

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Role-Based Access Control**: Granular permissions system
- **Rate Limiting**: API rate limiting to prevent abuse
- **HTTPS Enforcement**: All traffic encrypted with SSL/TLS
- **Security Headers**: Comprehensive security headers
- **Input Validation**: Server-side validation for all inputs

### Security Best Practices
1. Change default admin password immediately
2. Use strong, unique passwords
3. Enable two-factor authentication
4. Keep the system updated
5. Use proper SSL certificates
6. Configure firewall rules
7. Regular security audits

## 🚀 Deployment

### Production Deployment

1. **Server Requirements**:
   - Ubuntu 20.04/22.04 or Debian 11/12
   - 2+ CPU cores
   - 4GB+ RAM
   - 20GB+ disk space
   - Static IP address

2. **Domain Configuration**:
   - Point your domain to the server IP
   - Configure DNS records
   - Set up SSL certificates

3. **Firewall Configuration**:
   ```bash
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

4. **Monitoring Setup**:
   - Set up log monitoring
   - Configure backup monitoring
   - Set up uptime monitoring

### Docker Deployment

The system is containerized using Docker Compose for easy deployment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d
```

## 🔄 Upgrades

### Automatic Upgrade
```bash
./upgrade.sh
```

### Manual Upgrade
```bash
cd /opt/hosting-panel
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🗑️ Uninstallation

To completely remove the hosting control panel:

```bash
./uninstall.sh
```

This will:
- Stop all services
- Remove Docker containers and images
- Remove all data volumes
- Remove installation directory
- Clean up system files

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/contributing.md) for details.

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/hosting-control-panel.git
   cd hosting-control-panel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Run development servers**:
   ```bash
   # Control Plane
   cd apps/control-plane
   npm run start:dev

   # Client Portal
   cd apps/client-portal
   npm run dev

   # Helpdesk
   cd apps/helpdesk
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Community Support
- [GitHub Issues](https://github.com/your-org/hosting-control-panel/issues)
- [Discord Community](https://discord.gg/your-discord)
- [Documentation](https://docs.hosting-panel.com)

### Commercial Support
- **Premium Support**: Available for Premium and Enterprise licenses
- **Dedicated Support**: Available for Enterprise licenses
- **Custom Development**: Available for Enterprise licenses

## 🗺️ Roadmap

### Version 1.1 (Q2 2024)
- [ ] Advanced monitoring dashboard
- [ ] Email hosting management
- [ ] DNS management
- [ ] Load balancer configuration
- [ ] Container orchestration support

### Version 1.2 (Q3 2024)
- [ ] Mobile application
- [ ] Advanced backup strategies
- [ ] Multi-region support
- [ ] Advanced security features
- [ ] Plugin system

### Version 2.0 (Q4 2024)
- [ ] Kubernetes integration
- [ ] Advanced analytics
- [ ] AI-powered insights
- [ ] Advanced automation
- [ ] Enterprise integrations

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Docker](https://www.docker.com/) - Containerization platform

---

**Made with ❤️ by the Hosting Control Panel Team**
