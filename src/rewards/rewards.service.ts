import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { IExistingRewardsForUser } from './entities/existing-rewards';
import { Reward, RewardDocument } from './schemas/reward.schema';

/**
 * 1. Create a rewards for a user
 * 2. Redeem a reward with an ID
 * 3. Fetch rewards for a user
 * 4. Reward Redemption Statistics
 */

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  generateCode(): string {
    const nanoId1 = customAlphabet('ABCDEFGHIJKLMNOPQR', 3);
    const nanoId2 = customAlphabet('123456789', 3);
    return `${nanoId1()}-${nanoId2()}`;
  }

  /**
   * A helper function to create rewards for users
   * @param userId
   * @param percentage
   * @param tier
   * @param clientId
   * @returns
   */
  async createReward(
    userId: string,
    percentage: number,
    tier: number,
    clientId: string,
    validFromDate: moment.Moment,
  ) {
    return this.rewardModel.create({
      user: userId,
      discountPercentage: percentage,
      code: this.generateCode(),
      eligibleFrom: validFromDate.startOf('day').toISOString(),
      expires: new Date(
        validFromDate.add(20, 'day').startOf('day').toISOString(),
      ),
      tier,
      clientId,
    });
  }

  /**
   *
   * @param userId The user who needs to get the reward
   * @param clientId The client for which the user needs the reward
   * @returns List of rewards
   */
  async getRewardsForUser(userId: string, clientId: string): Promise<Reward[]> {
    const rewards = await this.rewardModel
      .find({
        user: userId,
        clientId: clientId,
      })
      // Adding lean so the message can be tacked on
      .lean();
    const now = moment();
    let messageApplied = false;
    let count = 0;
    let rewardNotApplicableToday = false;
    let isPreviousRedeemed = false;
    let previousRedeemedDate: moment.Moment;
    let redeemCount = 0;
    for (const reward of rewards) {
      count++;
      reward.enabled = false;
      if (reward.isRedeemed) {
        isPreviousRedeemed = true;
        previousRedeemedDate = moment(reward.redeemedOn);
        redeemCount++;
      } else if (isPreviousRedeemed) {
        isPreviousRedeemed = false;
        if (now.isSameOrAfter(moment(reward.eligibleFrom), 'day')) {
          // Basically if the previous offer is redeemed and the current reward is enabled
          reward.enabled = true;
        }
      }
      if (!messageApplied) {
        if (!reward.isRedeemed) {
          const rewardDate = moment(reward.createdAt);
          messageApplied = true;
          // If the reward is on the same day as the user's visit
          if (rewardDate.isSame(now, 'day')) {
            reward.message = `Flat ${reward.discountPercentage}% off on your next visit`;
            rewardNotApplicableToday = true;
          } else {
            reward.message = `Flat ${reward.discountPercentage}% off. Avail Now!`;
          }
          if (reward.discountPercentage === 5) {
            reward.message = 'Get 5% off your bill NOW!!';
          }
        }
        // Reward has been redeemed
        else {
          reward.message = `Congrats on your ${reward.discountPercentage}% discount!`;
        }
        // If message is not applied on the latest offer
      } else {
        if (rewardNotApplicableToday) {
          reward.message = `Flat ${reward.discountPercentage}% off on your visit after that`;
          isPreviousRedeemed = true;
        } else {
          if (isPreviousRedeemed) {
          }
          rewardNotApplicableToday = true;
          reward.message = `Flat ${reward.discountPercentage}% off, next visit`;
        }
      }
    }
    if (redeemCount === 0) {
      if (rewards[0]) rewards[0].enabled = true;
    }
    return rewards;
  }

  /**
   *
   * @param {string} userId
   * @param {string} clientId
   * @returns {Promise<IExistingRewardsForUser>}
   */
  async checkAndIssueRewards(
    userId: string,
    clientId: string,
  ): Promise<IExistingRewardsForUser> {
    const rewards = await this.getRewardsForUser(userId, clientId);

    // If the user already has rewards and check the latest tier
    if (rewards.length > 0) {
      let latestTier = 1;
      for (const reward of rewards) {
        if (!reward.isRedeemed) break;
        if (reward.tier > latestTier && reward.isRedeemed) {
          latestTier = reward.tier;
        }
      }
      return {
        newlyAlloted: false,
        rewards,
        currentTier: latestTier,
      };
    }
    await this.createReward(userId, 5, 1, clientId, moment().add(0, 'day'));
    await this.createReward(userId, 25, 2, clientId, moment().add(2, 'day'));
    await this.createReward(userId, 15, 3, clientId, moment().add(4, 'day'));
    await this.createReward(userId, 30, 4, clientId, moment().add(6, 'day'));
    return {
      newlyAlloted: true,
      rewards: await this.getRewardsForUser(userId, clientId),
      currentTier: 1,
    };
  }

  /**
   * Redeem a certain reward
   * @param {string} rewardId code to be redeemed
   * @returns Process Response
   */
  async redeemCode(rewardId: string) {
    return this.rewardModel.findByIdAndUpdate(rewardId, {
      isRedeemed: true,
      redeemedOn: new Date(moment().toISOString()),
    });
  }

  /**
   *
   */
  genericRewards() {
    return [
      {
        _id: '61d467be40e035b87743deed',
        discountPercentage: 5,
        eligibleFrom: new Date(moment().toISOString()),
        tier: 1,
        isRedeemed: false,
        isExpired: false,
        expires: new Date(moment().add(1, 'days').toISOString()),
        clientId: 'string',
        user: '61cd947fbfb4c83af7cd5b52',
        code: 'Login to enable!',
        createdAt: '2022-01-04T15:29:02.686Z',
        updatedAt: '2022-01-04T15:29:02.686Z',
        __v: 0,
        enabled: true,
        message: 'Flat 5% off your bill NOW!',
      },
      {
        _id: '61d467be40e035b87743deef',
        discountPercentage: 25,
        eligibleFrom: new Date(moment().toISOString()),
        tier: 2,
        isRedeemed: false,
        isExpired: false,
        expires: new Date(moment().add(20, 'days').toISOString()),
        clientId: 'string',
        user: '61cd947fbfb4c83af7cd5b52',
        code: 'GAD-596',
        createdAt: '2022-01-04T15:29:02.909Z',
        updatedAt: '2022-01-04T15:29:02.909Z',
        __v: 0,
        enabled: true,
        message: 'Flat 25% off on your second visit',
      },
      {
        _id: '61d467be40e035b87743def1',
        discountPercentage: 15,
        eligibleFrom: new Date(moment().toISOString()),
        tier: 3,
        isRedeemed: false,
        isExpired: false,
        expires: new Date(moment().add(40, 'days').toISOString()),
        clientId: 'string',
        user: '61cd947fbfb4c83af7cd5b52',
        code: 'KLQ-498',
        createdAt: '2022-01-04T15:29:02.996Z',
        updatedAt: '2022-01-04T15:29:02.996Z',
        __v: 0,
        enabled: false,
        message: 'Flat 15% off on your third visit',
      },
      {
        _id: '61d467bf40e035b87743def3',
        discountPercentage: 30,
        eligibleFrom: new Date(moment().toISOString()),
        tier: 4,
        isRedeemed: false,
        isExpired: false,
        expires: new Date(moment().add(60, 'days').toISOString()),
        clientId: 'string',
        user: '61cd947fbfb4c83af7cd5b52',
        code: 'LRF-663',
        createdAt: '2022-01-04T15:29:03.052Z',
        updatedAt: '2022-01-04T15:29:03.052Z',
        __v: 0,
        enabled: false,
        message: 'Flat 30% off on your fourth visit',
      },
    ];
  }
}
