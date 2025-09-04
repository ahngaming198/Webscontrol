import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBackupDto {
  @ApiProperty({ example: 'Daily Backup' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'site' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'org-id' })
  @IsString()
  organizationId: string;

  @ApiProperty({ example: 'server-id' })
  @IsString()
  serverId: string;

  @ApiProperty({ example: 'site-id', required: false })
  @IsOptional()
  @IsString()
  siteId?: string;
}
