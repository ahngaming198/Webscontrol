import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { LicensingService } from './licensing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, LicenseTier } from '@prisma/client';

@ApiTags('licensing')
@Controller('licensing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LicensingController {
  constructor(private readonly licensingService: LicensingService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Generate a new license key' })
  @ApiResponse({ status: 201, description: 'License generated successfully' })
  async generateLicense(
    @Body() body: { tier: LicenseTier; organizationId?: string; days?: number },
  ) {
    const licenseKey = this.licensingService.generateLicense(
      body.tier,
      body.organizationId,
      body.days || 365,
    );

    return {
      licenseKey,
      tier: body.tier,
      expiresIn: body.days || 365,
    };
  }

  @Post('assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign license to organization' })
  @ApiResponse({ status: 200, description: 'License assigned successfully' })
  async assignLicense(
    @Body() body: { organizationId: string; licenseKey: string },
  ) {
    await this.licensingService.assignLicenseToOrganization(
      body.organizationId,
      body.licenseKey,
    );

    return { message: 'License assigned successfully' };
  }

  @Post('check-feature')
  @ApiOperation({ summary: 'Check if organization has access to a feature' })
  @ApiResponse({ status: 200, description: 'Feature access checked' })
  async checkFeatureAccess(
    @Request() req,
    @Body() body: { feature: string },
  ) {
    const hasAccess = await this.licensingService.checkFeatureAccess(
      req.user.organizationId,
      body.feature,
    );

    return { hasAccess };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate organization license' })
  @ApiResponse({ status: 200, description: 'License validation result' })
  async validateLicense(@Request() req) {
    const isValid = await this.licensingService.validateOrganizationLicense(
      req.user.organizationId,
    );

    return { isValid };
  }
}
