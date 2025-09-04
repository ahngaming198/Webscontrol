import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateDatabaseDto {
  @ApiProperty({ example: 'my_database' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'db_user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secure_password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'mysql' })
  @IsString()
  type: string;

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
