import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LicenseTier } from '@prisma/client';

// Generate RSA key pair for license signing
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
}

function generateLicense(tier: LicenseTier, organizationId?: string, days: number = 365): string {
  const privateKey = process.env.LICENSE_PRIVATE_KEY;
  if (!privateKey) {
    console.error('LICENSE_PRIVATE_KEY environment variable is required');
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + (days * 24 * 60 * 60);

  const features = getFeaturesForTier(tier);

  const payload = {
    tier,
    organizationId,
    features,
    expiresAt,
    issuedAt: now,
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

function getFeaturesForTier(tier: LicenseTier): string[] {
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

async function main() {
  const args = process.argv.slice(2);
  const tierIndex = args.indexOf('--tier');
  const orgIndex = args.indexOf('--organization');
  const daysIndex = args.indexOf('--days');

  if (tierIndex === -1) {
    console.error('Usage: npm run generate-license -- --tier <tier> [--organization <orgId>] [--days <days>]');
    console.error('Tiers: COMMUNITY, PREMIUM, ENTERPRISE');
    process.exit(1);
  }

  const tier = args[tierIndex + 1] as LicenseTier;
  const organizationId = orgIndex !== -1 ? args[orgIndex + 1] : undefined;
  const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 365;

  if (!Object.values(LicenseTier).includes(tier)) {
    console.error('Invalid tier. Must be one of: COMMUNITY, PREMIUM, ENTERPRISE');
    process.exit(1);
  }

  try {
    const licenseKey = generateLicense(tier, organizationId, days);
    
    console.log('✅ License generated successfully!');
    console.log(`Tier: ${tier}`);
    console.log(`Organization ID: ${organizationId || 'Any'}`);
    console.log(`Expires in: ${days} days`);
    console.log(`License Key: ${licenseKey}`);
  } catch (error) {
    console.error('Error generating license:', error);
    process.exit(1);
  }
}

main();
