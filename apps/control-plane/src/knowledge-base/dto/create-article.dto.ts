import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'How to set up SSL certificate' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This article explains how to...' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'how-to-set-up-ssl-certificate' })
  @IsString()
  slug: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ example: 'category-id', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
