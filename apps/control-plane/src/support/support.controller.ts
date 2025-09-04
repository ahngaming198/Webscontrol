import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketReplyDto } from './dto/create-ticket-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('support')
@Controller('support')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.supportService.createTicket(createTicketDto);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async findAllTickets() {
    return this.supportService.findAllTickets();
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get support ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  async findOneTicket(@Param('id') id: string) {
    return this.supportService.findOneTicket(id);
  }

  @Post('tickets/:id/replies')
  @ApiOperation({ summary: 'Reply to support ticket' })
  @ApiResponse({ status: 201, description: 'Reply created successfully' })
  async createTicketReply(
    @Param('id') id: string,
    @Body() createTicketReplyDto: CreateTicketReplyDto,
  ) {
    return this.supportService.createTicketReply(createTicketReplyDto);
  }
}
