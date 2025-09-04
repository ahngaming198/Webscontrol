import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Website not loading' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'My website is not loading properly...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'MEDIUM', enum: TicketPriority, required: false })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;
}
