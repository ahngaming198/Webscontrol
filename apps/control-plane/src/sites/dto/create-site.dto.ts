import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'example.com' })
  @IsString()
  domain: string;

  @ApiProperty({ example: '/var/www/html' })
  @IsString()
  documentRoot: string;

  @ApiProperty({ example: '8.1', required: false })
  @IsOptional()
  @IsString()
  phpVersion?: string;

  @ApiProperty({ example: '18', required: false })
  @IsOptional()
  @IsString()
  nodeVersion?: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'org-id' })
  @IsString()
  organizationId: string;

  @ApiProperty({ example: 'server-id' })
  @IsString()
  serverId: string;
}
