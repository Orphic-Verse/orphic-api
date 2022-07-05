import {
  BadRequestException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AddStatDto } from './dto/add-stat.dto';
import { Stat, StatDocument } from './schemas/stat.schema';

/**
 * Stats service is used to track user's stastics and various
 * actions performed by the user
 */
@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stat.name) private readonly statsModel: Model<StatDocument>,
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}
  /**
   * Adding stats to the database
   * @param userId User's ID
   * @param data The data to be stored in the stat
   * @returns Success Message
   * @throws Invalid User Exception
   */
  async addStat(userId: string, data: AddStatDto) {
    const user = await this.usersModel.findById(userId);
    let stat = await this.statsModel.create({
      user: user._id,
      item: data.itemId,
      event: data.event,
      reward: data.rewardId,
      category: data.categoryId,
    });
    return 'Stats Recorded';
  }

  /**
   * Blindly get all stats in the database
   * @returns All the stats in the database
   */
  getAllStats() {
    return this.statsModel.find().populate('user item reward category');
  }
}
