import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsIP } from 'class-validator';

export class CreateServerDto {
  @ApiProperty({ example: 'Production Server' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'server1.example.com' })
  @IsString()
  hostname: string;

  @ApiProperty({ example: '192.168.1.100' })
  @IsIP()
  ipAddress: string;

  @ApiProperty({ example: 22, required: false })
  @IsOptional()
  @IsInt()
  port?: number;

  @ApiProperty({ example: 'org-id' })
  @IsString()
  organizationId: string;
}
