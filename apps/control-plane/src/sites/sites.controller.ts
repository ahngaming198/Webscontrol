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

import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('sites')
@Controller('sites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  async create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites' })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
  async findAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get site by ID' })
  @ApiResponse({ status: 200, description: 'Site retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update site' })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  async update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete site' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }

  @Post(':id/ssl/enable')
  @ApiOperation({ summary: 'Enable SSL for site' })
  @ApiResponse({ status: 200, description: 'SSL enabled successfully' })
  async enableSSL(@Param('id') id: string, @Body() body: { cert: string; key: string }) {
    return this.sitesService.enableSSL(id, body.cert, body.key);
  }

  @Post(':id/ssl/disable')
  @ApiOperation({ summary: 'Disable SSL for site' })
  @ApiResponse({ status: 200, description: 'SSL disabled successfully' })
  async disableSSL(@Param('id') id: string) {
    return this.sitesService.disableSSL(id);
  }
}
