import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   *
   * @param data Data to create and item
   * @returns The created data
   */
  async createItem(data: Item) {
    return this.itemModel.create(data);
  }

  /**
   *
   * @returns All items in the database
   */
  async findAllItems() {
    return this.itemModel.find();
  }

  /**
   *
   * @param mainCategory The main category for which the items need to be searched for
   * @returns all the items for the main category
   */
  async findAllItemsByMainCategory(mainCategory: string) {
    return this.itemModel
      .find({
        mainCategory,
      })
      .populate('mainCategory');
  }

  /**
   * @returns all categories in the database
   */
  async findAllCategories() {
    return this.categoryModel.find().sort({ listOrder: 1 });
  }
}
