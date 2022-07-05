import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, MaxLength, MinLength } from 'class-validator';

/**
 * DTO to help generate OTP
 */
export class GenerateOTPDto {
  @ApiProperty()
  @IsPhoneNumber('IN')
  phoneNumber: string;
}

/**
 * DTO to help verify OTP
 */
export class VerifyOTPDto {
  @ApiProperty()
  @IsPhoneNumber('IN')
  phoneNumber: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @MaxLength(4)
  @MinLength(4)
  otp: string;

  @ApiProperty()
  clientId: string;
}

/**
 * DTO to verify OTP Response
 */
export class VerifyOTPResponseDto {
  success: boolean;
  message: string;
}
