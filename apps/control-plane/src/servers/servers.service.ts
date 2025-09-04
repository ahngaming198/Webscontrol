import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(private prisma: PrismaService) {}

  async create(createServerDto: CreateServerDto) {
    return this.prisma.server.create({
      data: createServerDto,
    });
  }

  async findAll() {
    return this.prisma.server.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            sites: true,
            databases: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const server = await this.prisma.server.findUnique({
      where: { id },
      include: {
        organization: true,
        sites: true,
        databases: true,
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 100,
        },
      },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    return server;
  }

  async update(id: string, updateServerDto: UpdateServerDto) {
    const server = await this.findOne(id);
    
    return this.prisma.server.update({
      where: { id },
      data: updateServerDto,
    });
  }

  async remove(id: string) {
    const server = await this.findOne(id);
    
    await this.prisma.server.delete({
      where: { id },
    });

    return { message: 'Server deleted successfully' };
  }

  async updateMetrics(id: string, metrics: any) {
    await this.prisma.server.update({
      where: { id },
      data: {
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
        diskUsage: metrics.diskUsage,
        bandwidth: metrics.bandwidth,
        lastSeen: new Date(),
      },
    });

    // Store historical metrics
    await this.prisma.serverMetric.create({
      data: {
        serverId: id,
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
        diskUsage: metrics.diskUsage,
        bandwidth: metrics.bandwidth,
      },
    });
  }
}
