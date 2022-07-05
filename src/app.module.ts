import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import AdminJS, { ResourceWithOptions } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { AdminModule } from '@adminjs/nestjs';
import { User, UserSchema } from './users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { SchemaModule } from './schema/schema.module';
import { Item } from './items/schemas/item.schema';
import { Stat } from './stats/schemas/stat.schema';
import { RewardsModule } from './rewards/rewards.module';
import { Reward } from './rewards/schemas/reward.schema';
import { AuthModule } from './auth/auth.module';
import { Category } from './items/schemas/category.schema';
import { VisitHistory } from './users/schemas/visit-history.schema';

AdminJS.registerAdapter(AdminJSMongoose);

@Module({
  imports: [
    ConfigModule.forRoot({
      // Whichever is found first, shall be used by Nest
      envFilePath: ['.prod.env', '.dev.env', '.staging.env'],
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configuration().mongoUri,
      }),
      inject: [ConfigService],
    }),
    AdminModule.createAdminAsync({
      imports: [SchemaModule],
      inject: [
        getModelToken(User.name),
        getModelToken(Category.name),
        getModelToken(Item.name),
        getModelToken(Stat.name),
        getModelToken(Reward.name),
        getModelToken(VisitHistory.name),
      ],
      useFactory: (
        userModel: mongoose.Model<User>,
        categoryModel: mongoose.Model<Category>,
        itemModel: mongoose.Model<Item>,
        statsModel: mongoose.Model<Stat>,
        rewardsModel: mongoose.Model<Reward>,
        visitHistoryModel: mongoose.Model<VisitHistory>,
      ) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            userModel,
            categoryModel,
            itemModel,
            statsModel,
            rewardsModel,
            visitHistoryModel,
          ],
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client'),
    }),
    ItemsModule,
    UsersModule,
    StatsModule,
    RewardsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log(AdminJSMongoose);
