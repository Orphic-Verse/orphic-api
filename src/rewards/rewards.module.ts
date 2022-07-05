import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { UsersModule } from 'src/users/users.module';

/**
 * The module to handle all rewards
 */
@Module({
  imports: [
    // To avoid circular dep
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('rewards/generic')
      .forRoutes(RewardsController);
  }
}
