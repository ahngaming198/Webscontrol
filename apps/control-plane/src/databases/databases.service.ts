import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';

@Injectable()
export class DatabasesService {
  constructor(private prisma: PrismaService) {}

  async create(createDatabaseDto: CreateDatabaseDto) {
    return this.prisma.database.create({
      data: createDatabaseDto,
    });
  }

  async findAll() {
    return this.prisma.database.findMany({
      include: {
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
    const database = await this.prisma.database.findUnique({
      where: { id },
      include: {
        organization: true,
        server: true,
        site: true,
      },
    });

    if (!database) {
      throw new NotFoundException('Database not found');
    }

    return database;
  }

  async update(id: string, updateDatabaseDto: UpdateDatabaseDto) {
    const database = await this.findOne(id);
    
    return this.prisma.database.update({
      where: { id },
      data: updateDatabaseDto,
    });
  }

  async remove(id: string) {
    const database = await this.findOne(id);
    
    await this.prisma.database.delete({
      where: { id },
    });

    return { message: 'Database deleted successfully' };
  }
}
