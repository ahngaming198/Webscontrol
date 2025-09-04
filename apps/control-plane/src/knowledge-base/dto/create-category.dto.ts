import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'SSL & Security' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ssl-security' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Articles about SSL certificates and security', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
