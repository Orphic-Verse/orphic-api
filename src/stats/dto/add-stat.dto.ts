import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import * as mongoose from 'mongoose';
import { StatEvents } from '../schemas/stat.schema';

export class AddStatDto {
  @ApiProperty({
    enum: Object.values(StatEvents),
  })
  @IsNotEmpty()
  @IsEnum(StatEvents)
  event: StatEvents;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  itemId: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  rewardId: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  categoryId: string;
}
