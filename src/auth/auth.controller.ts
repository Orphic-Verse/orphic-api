import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, request, Response } from 'express';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GenerateOTPDto, VerifyOTPDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(new TransformInterceptor())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  /**
   *
   * @param data Phone Number to generate the OTP with
   * @returns Client Response with the success or failure
   */
  @Post('/otp/generate')
  generateOtp(@Body() data: GenerateOTPDto) {
    return this.authService.generateOtp(data.phoneNumber);
  }

  /**
   *
   * @param request Express Request
   * @param response Express Response
   * @param data Includes PhoneNumber, Name and ClientId
   * @returns Response to the client with the token
   */
  @Post('/otp/verify')
  async verifyOtp(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() data: VerifyOTPDto,
  ) {
    const otpResponse = await this.authService.verifyOtp(
      data.phoneNumber,
      data.otp,
    );

    // Extract clientId from the headers
    const clientId: string =
      (request.headers['clientId'] as string) ?? data.clientId;

    // // If clientId is not there
    // if (clientId) {
    //   throw new HttpException(
    //     'Provide clientId in the request header',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const userData = await this.userService.login({
      userName: data.name,
      phoneNumber: data.phoneNumber,
      clientId,
    });

    response.cookie('accessToken', userData.token);
    response.cookie('clientId', clientId);

    return userData;
  }
}
