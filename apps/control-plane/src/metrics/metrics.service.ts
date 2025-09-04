import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getSystemMetrics() {
    const [
      totalUsers,
      totalOrganizations,
      totalServers,
      totalSites,
      totalDatabases,
      totalBackups,
      activeServers,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.server.count(),
      this.prisma.site.count(),
      this.prisma.database.count(),
      this.prisma.backup.count(),
      this.prisma.server.count({ where: { status: 'ONLINE' } }),
    ]);

    return {
      totalUsers,
      totalOrganizations,
      totalServers,
      totalSites,
      totalDatabases,
      totalBackups,
      activeServers,
    };
  }

  async getServerMetrics(serverId: string) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      include: {
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 24, // Last 24 hours
        },
      },
    });

    if (!server) {
      return null;
    }

    return {
      server,
      metrics: server.metrics,
    };
  }

  async getOrganizationMetrics(organizationId: string) {
    const [
      users,
      servers,
      sites,
      databases,
      backups,
    ] = await this.prisma.$transaction([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.server.count({ where: { organizationId } }),
      this.prisma.site.count({ where: { organizationId } }),
      this.prisma.database.count({ where: { organizationId } }),
      this.prisma.backup.count({ where: { organizationId } }),
    ]);

    return {
      users,
      servers,
      sites,
      databases,
      backups,
    };
  }
}
