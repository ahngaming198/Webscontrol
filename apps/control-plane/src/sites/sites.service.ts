import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async create(createSiteDto: CreateSiteDto) {
    return this.prisma.site.create({
      data: createSiteDto,
    });
  }

  async findAll() {
    return this.prisma.site.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        server: {
          select: {
            id: true,
            name: true,
            hostname: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        user: true,
        organization: true,
        server: true,
        databases: true,
        backups: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const site = await this.findOne(id);
    
    return this.prisma.site.update({
      where: { id },
      data: updateSiteDto,
    });
  }

  async remove(id: string) {
    const site = await this.findOne(id);
    
    await this.prisma.site.delete({
      where: { id },
    });

    return { message: 'Site deleted successfully' };
  }

  async enableSSL(id: string, cert: string, key: string) {
    return this.prisma.site.update({
      where: { id },
      data: {
        sslEnabled: true,
        sslCert: cert,
        sslKey: key,
      },
    });
  }

  async disableSSL(id: string) {
    return this.prisma.site.update({
      where: { id },
      data: {
        sslEnabled: false,
        sslCert: null,
        sslKey: null,
      },
    });
  }
}
