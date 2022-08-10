import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { TransformInterceptor } from "src/common/interceptors/transform.interceptor";
import { Item } from "./schemas/item.schema";
import { ItemsService } from "./items.service";
import { ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "src/common/pipes/parse-objectid.pipe";

@UseInterceptors(new TransformInterceptor())
@Controller("items")
@ApiTags("Items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  addItem(@Body() itemData: Item) {
    return this.itemsService.createItem(itemData);
  }

  @Get()
  allItems() {
    return this.itemsService.findAllItems();
  }

  @Get("/category/:mainCategoryId")
  allItemsForCategory(
    @Param("mainCategoryId", ParseObjectIdPipe) mainCategoryId: string,
  ) {
    return this.itemsService.findAllItemsByMainCategory(mainCategoryId);
  }

  @Get("/categories")
  allMainCateogories() {
    const categories = this.itemsService.findAllCategories();
    console.log(categories);
    return categories;
  }
}
