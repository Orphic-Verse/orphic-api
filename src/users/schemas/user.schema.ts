import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

/**
 * The basic User model to track user details and information
 */
@Schema({
  timestamps: true,
})
export class User {
  _id: string;

  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @IsNotEmpty()
  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  lastUsed: Date;

  @Prop()
  walletAddress: string;
}

/**
 * The type to access the UserDocument
 */
export type UserDocument = User & Document;

/**
 * Mongoose Schema from the User document
 */
export const UserSchema = SchemaFactory.createForClass(User);
