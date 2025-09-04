import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseTier } from '@prisma/client';

export interface LicensePayload {
  tier: LicenseTier;
  organizationId?: string;
  features: string[];
  expiresAt: number;
  issuedAt: number;
}

@Injectable()
export class LicensingService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  generateLicense(tier: LicenseTier, organizationId?: string, days: number = 365): string {
    const privateKey = this.configService.get<string>('LICENSE_PRIVATE_KEY');
    if (!privateKey) {
      throw new BadRequestException('License private key not configured');
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (days * 24 * 60 * 60);

    const features = this.getFeaturesForTier(tier);

    const payload: LicensePayload = {
      tier,
      organizationId,
      features,
      expiresAt,
      issuedAt: now,
    };

    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  verifyLicense(licenseKey: string): LicensePayload | null {
    try {
      const publicKey = this.configService.get<string>('LICENSE_PUBLIC_KEY');
      if (!publicKey) {
        throw new BadRequestException('License public key not configured');
      }

      const decoded = jwt.verify(licenseKey, publicKey, { algorithms: ['RS256'] }) as LicensePayload;
      
      // Check if license is expired
      if (decoded.expiresAt < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  async assignLicenseToOrganization(organizationId: string, licenseKey: string): Promise<void> {
    const license = this.verifyLicense(licenseKey);
    if (!license) {
      throw new BadRequestException('Invalid or expired license');
    }

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        licenseKey,
        licenseTier: license.tier,
        licenseExpiresAt: new Date(license.expiresAt * 1000),
      },
    });
  }

  async checkFeatureAccess(organizationId: string, feature: string): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.licenseKey) {
      return false;
    }

    const license = this.verifyLicense(organization.licenseKey);
    if (!license) {
      return false;
    }

    return license.features.includes(feature);
  }

  async getOrganizationLicense(organizationId: string): Promise<LicensePayload | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.licenseKey) {
      return null;
    }

    return this.verifyLicense(organization.licenseKey);
  }

  private getFeaturesForTier(tier: LicenseTier): string[] {
    const baseFeatures = [
      'sites:create',
      'sites:manage',
      'databases:create',
      'databases:manage',
      'ssl:basic',
      'support:basic',
    ];

    switch (tier) {
      case LicenseTier.COMMUNITY:
        return baseFeatures;

      case LicenseTier.PREMIUM:
        return [
          ...baseFeatures,
          'backups:automated',
          'backups:s3',
          'monitoring:advanced',
          'servers:multiple',
          'ssl:wildcard',
          'support:priority',
        ];

      case LicenseTier.ENTERPRISE:
        return [
          ...baseFeatures,
          'backups:automated',
          'backups:s3',
          'monitoring:advanced',
          'servers:multiple',
          'ssl:wildcard',
          'support:priority',
          'white-label',
          'custom-branding',
          'api:unlimited',
          'support:dedicated',
        ];

      default:
        return baseFeatures;
    }
  }

  async validateOrganizationLicense(organizationId: string): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.licenseKey) {
      return false;
    }

    const license = this.verifyLicense(organization.licenseKey);
    return license !== null;
  }
}
