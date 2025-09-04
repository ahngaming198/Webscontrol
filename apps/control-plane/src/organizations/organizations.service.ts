import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: createOrganizationDto.slug },
    });

    if (existingOrg) {
      throw new ConflictException('Organization with this slug already exists');
    }

    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            servers: true,
            sites: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLogin: true,
          },
        },
        servers: true,
        sites: true,
        databases: true,
        _count: {
          select: {
            users: true,
            servers: true,
            sites: true,
            databases: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.findOne(id);
    
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    const organization = await this.findOne(id);
    
    await this.prisma.organization.delete({
      where: { id },
    });

    return { message: 'Organization deleted successfully' };
  }

  async getStats(id: string) {
    const organization = await this.findOne(id);
    
    const stats = await this.prisma.$transaction([
      this.prisma.user.count({ where: { organizationId: id } }),
      this.prisma.server.count({ where: { organizationId: id } }),
      this.prisma.site.count({ where: { organizationId: id } }),
      this.prisma.database.count({ where: { organizationId: id } }),
      this.prisma.backup.count({ where: { organizationId: id } }),
    ]);

    return {
      users: stats[0],
      servers: stats[1],
      sites: stats[2],
      databases: stats[3],
      backups: stats[4],
    };
  }
}
