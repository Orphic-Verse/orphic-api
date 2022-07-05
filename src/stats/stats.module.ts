import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stat, StatSchema } from './schemas/stat.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Stat.name, schema: StatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(StatsController);
  }
}
