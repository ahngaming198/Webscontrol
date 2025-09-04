import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { BackupsService } from './backups.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('backups')
@Controller('backups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup created successfully' })
  async create(@Body() createBackupDto: CreateBackupDto) {
    return this.backupsService.create(createBackupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all backups' })
  @ApiResponse({ status: 200, description: 'Backups retrieved successfully' })
  async findAll() {
    return this.backupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get backup by ID' })
  @ApiResponse({ status: 200, description: 'Backup retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.backupsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete backup' })
  @ApiResponse({ status: 200, description: 'Backup deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.backupsService.remove(id);
  }
}
