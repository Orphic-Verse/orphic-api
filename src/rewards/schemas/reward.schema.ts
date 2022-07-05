import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type RewardDocument = Reward & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Reward {
  @Prop({ requried: true })
  code: string; // The code to be shown to the user

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: string | User; // The user to which the reward is assigned to

  @Prop({ required: true })
  clientId: string; // The client to which the reward is applied to

  @Prop({ required: true })
  expires: Date; // The date on which the reward expires

  @Prop({ default: false })
  isExpired: boolean; // Tells if the reward is expired or not

  @Prop()
  redeemedOn: Date; // The date on which the redemption happened

  @Prop({ default: false })
  isRedeemed: boolean; // Tells if the reward is redeemed

  @Prop({ default: 1 })
  tier: number; // The tier of the reward. 1, 2, 3 denotes the different tiers to which the reward belongs to

  @Prop({ required: true })
  eligibleFrom: Date; // The start date of eligiblity

  @Prop({ default: 0 })
  discountPercentage: number;

  createdAt: Date;
  message: String; // Dynamically generated string. Not necessarily stored in the database
  enabled: boolean;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
