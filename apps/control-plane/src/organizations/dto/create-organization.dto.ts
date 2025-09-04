import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'acme-corp' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ example: 'https://acme.com', required: false })
  @IsOptional()
  @IsUrl()
  domain?: string;
}
