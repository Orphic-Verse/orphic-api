import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { RewardsModule } from 'src/rewards/rewards.module';
import { VisitHistoryService } from './visit-history/visit-history.service';
import {
  VisitHistory,
  VisitHistorySchema,
} from './schemas/visit-history.schema';

@Module({
  imports: [
    // Required to assign rewards on fetch profile
    RewardsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VisitHistory.name, schema: VisitHistorySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, VisitHistoryService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
