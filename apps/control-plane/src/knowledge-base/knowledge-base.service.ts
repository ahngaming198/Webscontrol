import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class KnowledgeBaseService {
  constructor(private prisma: PrismaService) {}

  async createArticle(createArticleDto: CreateArticleDto) {
    return this.prisma.knowledgeBaseArticle.create({
      data: createArticleDto,
    });
  }

  async findAllArticles() {
    return this.prisma.knowledgeBaseArticle.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOneArticle(id: string) {
    const article = await this.prisma.knowledgeBaseArticle.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.knowledgeBaseCategory.create({
      data: createCategoryDto,
    });
  }

  async findAllCategories() {
    return this.prisma.knowledgeBaseCategory.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }
}
