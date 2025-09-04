import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTicketReplyDto {
  @ApiProperty({ example: 'Thank you for your message...' })
  @IsString()
  message: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;

  @ApiProperty({ example: 'ticket-id' })
  @IsString()
  ticketId: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;
}
