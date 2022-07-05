import { Reward } from '../schemas/reward.schema';

export interface IExistingRewardsForUser {
  rewards: Reward[];
  newlyAlloted: boolean;
  currentTier: number;
}
