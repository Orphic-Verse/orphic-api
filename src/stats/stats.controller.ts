import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AddStatDto } from './dto/add-stat.dto';
import { StatsService } from './stats.service';

/**
 * Controller to enable stats tracking for the application
 */
@ApiTags('Stats')
@UseInterceptors(new TransformInterceptor())
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   *
   * @param data Data to add to the stats db
   * @returns the database record added
   */
  @Post()
  addStat(@Req() request: Request, @Body() data: AddStatDto) {
    const id = request.user._id;
    return this.statsService.addStat(id, data);
  }

  /**
   *
   * @returns All the stats in the database
   */
  @Get()
  getAllStats() {
    return this.statsService.getAllStats();
  }
}
