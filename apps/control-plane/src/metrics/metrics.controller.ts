import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('metrics')
@Controller('metrics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('system')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get system-wide metrics' })
  @ApiResponse({ status: 200, description: 'System metrics retrieved successfully' })
  async getSystemMetrics() {
    return this.metricsService.getSystemMetrics();
  }

  @Get('server/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Get server metrics' })
  @ApiResponse({ status: 200, description: 'Server metrics retrieved successfully' })
  async getServerMetrics(@Param('id') id: string) {
    return this.metricsService.getServerMetrics(id);
  }

  @Get('organization/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get organization metrics' })
  @ApiResponse({ status: 200, description: 'Organization metrics retrieved successfully' })
  async getOrganizationMetrics(@Param('id') id: string) {
    return this.metricsService.getOrganizationMetrics(id);
  }
}
