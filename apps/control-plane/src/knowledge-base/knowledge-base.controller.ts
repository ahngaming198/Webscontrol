import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('knowledge-base')
@Controller('knowledge-base')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post('articles')
  @ApiOperation({ summary: 'Create a new knowledge base article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.knowledgeBaseService.createArticle(createArticleDto);
  }

  @Get('articles')
  @ApiOperation({ summary: 'Get all knowledge base articles' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async findAllArticles() {
    return this.knowledgeBaseService.findAllArticles();
  }

  @Get('articles/:id')
  @ApiOperation({ summary: 'Get knowledge base article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  async findOneArticle(@Param('id') id: string) {
    return this.knowledgeBaseService.findOneArticle(id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new knowledge base category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.knowledgeBaseService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all knowledge base categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAllCategories() {
    return this.knowledgeBaseService.findAllCategories();
  }
}
