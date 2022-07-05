import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Item } from '../../items/schemas/item.schema';
import { Reward, RewardSchema } from 'src/rewards/schemas/reward.schema';
import { Category } from 'src/items/schemas/category.schema';

export enum StatEvents {
  USER_OPENED_VIEW_AR = 'USER_OPENED_VIEW_AR',
  USER_CLOSED_VIEW_AR = 'USER_CLOSED_VIEW_AR',
  USER_OPENED_MODEL = 'USER_OPENED_MODEL',
  USER_CLOSED_MODEL = 'USER_CLOSED_MODEL',
  // ------
  USER_ENTERED_REWARDS_SCREEN = 'USER_ENTERED_REWARDS_SCREEN',
  USER_EXITED_REWARDS_SCREEN = 'USER_EXITED_REWARDS_SCREEN',
  // ------
  USER_CANCELLED_POPUP = 'USER_CANCELLED_POPUP',
  USER_ACCEPTED_POPUP = 'USER_ACCEPTED_POPUP',
  // ------
  USER_OPENED_REWARD = 'USER_OPENED_REWARD',
  USER_CLOSED_REWARD = 'USER_CLOSED_REWARD',
  // ------
  USER_OPENED_CATEGORY = 'USER_OPENED_CATEGORY',
  USER_CLOSED_CATEGORY = 'USER_CLOSED_CATEGORY',
  // ------
  USER_OPENED_ITEM = 'USER_OPENED_ITEM',
  USER_CLOSED_ITEM = 'USER_CLOSED_ITEM',
}

@Schema({
  timestamps: true,
})
export class Stat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: string | User;

  @Prop({ enum: Object.values(StatEvents) })
  event: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Item.name })
  item: string | Item;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Reward.name })
  reward: string | Reward;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: string | Category;
}

export type StatDocument = mongoose.Document & Stat;

export const StatSchema = SchemaFactory.createForClass(Stat);
