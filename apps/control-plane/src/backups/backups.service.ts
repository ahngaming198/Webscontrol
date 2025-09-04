import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBackupDto } from './dto/create-backup.dto';

@Injectable()
export class BackupsService {
  constructor(private prisma: PrismaService) {}

  async create(createBackupDto: CreateBackupDto) {
    return this.prisma.backup.create({
      data: createBackupDto,
    });
  }

  async findAll() {
    return this.prisma.backup.findMany({
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
        site: {
          select: {
            id: true,
            domain: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const backup = await this.prisma.backup.findUnique({
      where: { id },
      include: {
        user: true,
        organization: true,
        server: true,
        site: true,
      },
    });

    if (!backup) {
      throw new NotFoundException('Backup not found');
    }

    return backup;
  }

  async remove(id: string) {
    const backup = await this.findOne(id);
    
    await this.prisma.backup.delete({
      where: { id },
    });

    return { message: 'Backup deleted successfully' };
  }
}
