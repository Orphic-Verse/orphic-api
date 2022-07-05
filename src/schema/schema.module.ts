import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/items/schemas/category.schema';
import { Item, ItemSchema } from 'src/items/schemas/item.schema';
import { Reward, RewardSchema } from 'src/rewards/schemas/reward.schema';
import { Stat, StatSchema } from 'src/stats/schemas/stat.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  VisitHistory,
  VisitHistorySchema,
} from 'src/users/schemas/visit-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Stat.name, schema: StatSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Item.name, schema: ItemSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: VisitHistory.name, schema: VisitHistorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
