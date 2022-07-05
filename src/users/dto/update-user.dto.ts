import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/** DTO to update user's wallet address with an Auth Token */
export class UpdateUserWalletDto {
  /** The wallet address to be updated */
  walletAddress: string;
  /** The AUTH Token sent to the user */
  token: string;
}
