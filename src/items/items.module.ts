import { Controller, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {
  // Removing authentication for items
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes(ItemsController);
  // }
}
