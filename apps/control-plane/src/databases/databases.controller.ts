import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { DatabasesService } from './databases.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('databases')
@Controller('databases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new database' })
  @ApiResponse({ status: 201, description: 'Database created successfully' })
  async create(@Body() createDatabaseDto: CreateDatabaseDto) {
    return this.databasesService.create(createDatabaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all databases' })
  @ApiResponse({ status: 200, description: 'Databases retrieved successfully' })
  async findAll() {
    return this.databasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get database by ID' })
  @ApiResponse({ status: 200, description: 'Database retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.databasesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update database' })
  @ApiResponse({ status: 200, description: 'Database updated successfully' })
  async update(@Param('id') id: string, @Body() updateDatabaseDto: UpdateDatabaseDto) {
    return this.databasesService.update(id, updateDatabaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete database' })
  @ApiResponse({ status: 200, description: 'Database deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.databasesService.remove(id);
  }
}
