import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  clientId: string; // Client ID to send the appropriate data
}

export interface LoginUserResponseDto {
  token: string;
  userId: string;
}
