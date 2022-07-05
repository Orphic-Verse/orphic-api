import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Request } from 'express';
import { RewardsService } from 'src/rewards/rewards.service';
import { VisitHistoryService } from './visit-history/visit-history.service';
import * as moment from 'moment';
import { UpdateUserWalletDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('Users')
@UseInterceptors(new TransformInterceptor())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rewardsService: RewardsService,
    private readonly visitHistoryService: VisitHistoryService,
  ) {}

  @Get('wallet-token')
  getWalletToken(@Req() request: Request) {
    return this.usersService.generateWalletToken(request.user);
  }

  @Get('profile')
  async profile(@Req() request: Request) {
    const rewards = await this.rewardsService.checkAndIssueRewards(
      request.user._id,
      request.clientId,
    );
    const lastVisit = await this.visitHistoryService.getLastVisit(
      request.user._id,
      request.clientId,
    );
    let shouldShowPopup = false;
    if (!lastVisit) shouldShowPopup = true;
    else if (
      moment(lastVisit.createdAt).isBefore(moment().subtract(1, 'day'))
    ) {
      shouldShowPopup = true;
    }

    // Disabling Pop Ups
    shouldShowPopup = false;
    await this.visitHistoryService.track(request.user._id, request.clientId);
    return {
      user: request.user,
      rewards,
      rewardsMessages: shouldShowPopup
        ? [
            {
              title: 'You got discounts!',
              message: 'Give me 20% off?',
            },
          ]
        : [],
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /** Update the user's wallet address with a token */
  @Post('wallet')
  updateWallet(@Body() data: UpdateUserWalletDto) {
    return this.usersService.updateWalletWithToken(
      data.token,
      data.walletAddress,
    );
  }
}
