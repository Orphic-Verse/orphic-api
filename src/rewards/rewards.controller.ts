import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { RewardsService } from './rewards.service';
import { Reward } from './schemas/reward.schema';

@Controller('rewards')
@ApiTags('Rewards')
@UseInterceptors(new TransformInterceptor())
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  /**
   *
   * @param {Request} request
   * @returns
   */
  @Get('user')
  getAllRewards(@Req() request: Request) {
    return this.rewardsService.getRewardsForUser(
      request.user?._id,
      request.clientId,
    );
  }

  /**
   * Return a fake rewards to lure users into logging in
   * @returns {Reward[]}
   */
  @Get('generic')
  getGenericRewards() {
    return this.rewardsService.genericRewards();
  }

  /**
   * Redeem a reward for the user with the ID
   * @param {string} rewardId The reward ID to redeem
   * @returns success or failure response
   */
  @Post('redeem/:rewardId')
  redeemReward(@Param('rewardId', ParseObjectIdPipe) rewardId: string) {
    return this.rewardsService.redeemCode(rewardId);
  }
}
