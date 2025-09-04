# Getting Started Guide

Welcome to the Hosting Control Panel! This guide will help you get up and running quickly.

## Table of Contents

- [Installation](#installation)
- [First Login](#first-login)
- [Creating Your First Site](#creating-your-first-site)
- [Setting Up SSL](#setting-up-ssl)
- [Creating a Database](#creating-a-database)
- [Setting Up Backups](#setting-up-backups)
- [Next Steps](#next-steps)

## Installation

### Quick Installation

The easiest way to install the Hosting Control Panel is using our automated installation script:

```bash
curl -fsSL https://raw.githubusercontent.com/your-org/hosting-control-panel/main/install.sh | sudo bash
```

### Manual Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/hosting-control-panel.git
   cd hosting-control-panel
   ```

2. **Install dependencies**:
   ```bash
   chmod +x install.sh
   sudo ./install.sh
   ```

3. **Access the control panel**:
   Open your browser and navigate to `https://your-server-ip`

## First Login

1. **Use the default credentials**:
   - Email: `admin@local`
   - Password: `ChangeMe!`

2. **Change your password**:
   - Go to Settings → Profile
   - Click "Change Password"
   - Enter a strong, unique password

3. **Enable Two-Factor Authentication** (Recommended):
   - Go to Settings → Security
   - Click "Enable 2FA"
   - Scan the QR code with your authenticator app
   - Enter the verification code

## Creating Your First Site

1. **Navigate to Sites**:
   - Click "Sites" in the sidebar
   - Click "Add Site"

2. **Configure your site**:
   - **Domain**: Enter your domain name (e.g., `example.com`)
   - **Document Root**: Choose where to store your files (e.g., `/var/www/example.com`)
   - **PHP Version**: Select your preferred PHP version
   - **Node Version**: Select your preferred Node.js version (if needed)

3. **Create the site**:
   - Click "Create Site"
   - Wait for the site to be created
   - Upload your website files to the document root

## Setting Up SSL

### Using Let's Encrypt (Recommended)

1. **Navigate to your site**:
   - Go to Sites → Your Site → SSL

2. **Enable Let's Encrypt**:
   - Click "Enable Let's Encrypt"
   - Enter your email address
   - Click "Request Certificate"

3. **Wait for verification**:
   - The system will automatically verify your domain
   - SSL will be enabled once verification is complete

### Using Custom SSL Certificate

1. **Navigate to your site**:
   - Go to Sites → Your Site → SSL

2. **Upload certificate**:
   - Click "Upload Custom Certificate"
   - Paste your certificate and private key
   - Click "Save"

## Creating a Database

1. **Navigate to Databases**:
   - Click "Databases" in the sidebar
   - Click "Add Database"

2. **Configure your database**:
   - **Name**: Enter a database name
   - **Type**: Choose MySQL or PostgreSQL
   - **Username**: Enter a username
   - **Password**: Enter a strong password

3. **Create the database**:
   - Click "Create Database"
   - Note down the connection details

4. **Connect to your database**:
   - Use the provided connection details
   - Host: `localhost`
   - Port: `3306` (MySQL) or `5432` (PostgreSQL)

## Setting Up Backups

### Automated Backups

1. **Navigate to Backups**:
   - Click "Backups" in the sidebar
   - Click "Create Backup"

2. **Configure backup**:
   - **Name**: Enter a descriptive name
   - **Type**: Choose Site, Database, or Full backup
   - **Schedule**: Set up automatic backup schedule
   - **Storage**: Configure S3 storage (Premium feature)

3. **Create backup**:
   - Click "Create Backup"
   - Monitor the backup progress

### Manual Backups

1. **Navigate to Backups**:
   - Click "Backups" in the sidebar
   - Click "Create Backup"

2. **Select what to backup**:
   - Choose your site or database
   - Click "Create Backup Now"

## Next Steps

Now that you have the basics set up, here are some recommended next steps:

### 1. Configure Your Domain

- Point your domain's DNS to your server
- Update your site's domain settings
- Test your website

### 2. Set Up Monitoring

- Enable server monitoring
- Set up alerts for critical issues
- Monitor your site's performance

### 3. Configure Email

- Set up email accounts for your domain
- Configure email forwarding
- Set up spam filtering

### 4. Security Hardening

- Enable firewall rules
- Set up fail2ban
- Configure security headers
- Regular security updates

### 5. Performance Optimization

- Enable caching
- Optimize database settings
- Configure CDN (if available)
- Monitor resource usage

## Common Tasks

### Managing Users

1. **Add a new user**:
   - Go to Users → Add User
   - Fill in user details
   - Assign appropriate role

2. **Manage permissions**:
   - Go to Users → Select User → Permissions
   - Configure what the user can access

### Managing Servers

1. **Add a new server**:
   - Go to Servers → Add Server
   - Enter server details
   - Install the agent

2. **Monitor server health**:
   - View server metrics
   - Check resource usage
   - Monitor uptime

### Managing Organizations

1. **Create organization**:
   - Go to Organizations → Add Organization
   - Configure organization settings
   - Assign users

2. **Manage licenses**:
   - Go to Organizations → Select Organization → License
   - Configure license tier
   - Set expiration date

## Troubleshooting

### Common Issues

1. **Site not loading**:
   - Check if the site is enabled
   - Verify DNS settings
   - Check server logs

2. **SSL certificate issues**:
   - Verify domain ownership
   - Check certificate expiration
   - Ensure proper DNS configuration

3. **Database connection issues**:
   - Verify database credentials
   - Check database status
   - Review connection logs

### Getting Help

- **Documentation**: Check our comprehensive documentation
- **Community**: Join our Discord community
- **Support**: Submit a support ticket
- **GitHub**: Report issues on GitHub

## Best Practices

### Security

- Use strong passwords
- Enable two-factor authentication
- Keep the system updated
- Regular security audits
- Monitor access logs

### Performance

- Optimize your applications
- Use caching where appropriate
- Monitor resource usage
- Regular maintenance
- Backup regularly

### Maintenance

- Regular updates
- Monitor logs
- Clean up old files
- Optimize databases
- Review security settings

---

**Need more help?** Check out our [full documentation](https://docs.hosting-panel.com) or [contact support](https://support.hosting-panel.com).
