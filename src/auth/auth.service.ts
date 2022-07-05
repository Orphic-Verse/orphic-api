import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import configuration from 'config/configuration';
import { VerifyOTPResponseDto } from './dto/auth.dto';

/**
 * Authentication service, capable of handling OTP's and cookie settings
 */
@Injectable()
export class AuthService {
  /**
   *
   * @param phoneNumber
   * @returns A message
   * @description The objective of this service function is to
   * reliably generate an OTP based on the given environment
   */
  async generateOtp(phoneNumber: string) {
    if (configuration().environments.isProduction()) {
      const authKey = configuration().msg91.authKey;
      const templateId = configuration().msg91.templateId;
      const invisible = '0';
      const otpLength = '4';
      const url = `https://api.msg91.com/api/v5/otp?authkey=${authKey}&template_id=${templateId}&mobile=91${phoneNumber}&invisible=${invisible}&otp_length=${otpLength}`;
      try {
        const res = await axios.get(url);
        if (res.data.type === 'error') throw 'Error';
        return 'OTP Sent Successfully';
      } catch (e) {
        throw new HttpException(
          'Error generating OTP',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return 'Template OTP sent succesfully - Use 4321';
    }
  }

  /**
   *
   * @param phoneNumber
   * @param otp
   * @returns
   */
  async verifyOtp(
    phoneNumber: string,
    otp: string,
  ): Promise<VerifyOTPResponseDto> {
    if (configuration().environments.isProduction()) {
      const authKey = configuration().msg91.authKey;
      try {
        const resp = await axios.get(
          `https://api.msg91.com/api/v5/otp/verify?mobile=91${phoneNumber}&otp=${otp}&authkey=${authKey}`,
        );
        const json = await resp.data;
        console.log(json);

        if (json.type === 'error') {
          throw new HttpException(json.message, HttpStatus.BAD_REQUEST);
        }
      } catch (e) {
        if (e instanceof HttpException) throw e;
        throw new InternalServerErrorException();
      }
      return {
        success: true,
        message: 'OTP Verified',
      };
    }
    if (otp === '4321') {
      return {
        success: true,
        message: 'Template OTP Verified',
      };
    }
    throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
  }
}
