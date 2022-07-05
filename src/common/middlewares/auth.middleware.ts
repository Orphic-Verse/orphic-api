import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction, response } from 'express';
import { UsersService } from 'src/users/users.service';

/**
 * - A middleware to check for user token in the cookie
 * and set the user object in the request for ease of access.
 * - Also takes care of setting the `clientId`, which is requried
 * to differentiate between clients
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   *
   * @param userService User Service being injected
   */
  constructor(private readonly userService: UsersService) {}

  /**
   *
   * @param req The request data of the current request
   * @param res Response data of the curent request
   * @param next Next function passthrought
   * @throws Unauthorized Exception
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken: accessTokenFromCookie, clientId: clientIdFromCookie } =
      req.cookies;
    // Headers doesn't recognise uppercase characters
    const { accesstoken: accessTokenFromHeader, clientid: clientIdFromHeader } =
      req.headers;
    if (!accessTokenFromCookie && !accessTokenFromHeader) {
      throw new UnauthorizedException();
    }
    try {
      let accessToken;

      // If the token is from cookie or header
      if (accessTokenFromCookie) accessToken = accessTokenFromCookie;
      else if (accessTokenFromHeader) accessToken = accessTokenFromHeader;

      const userId = await this.userService.verifyToken(accessToken);
      const user = await this.userService.findOne(userId);
      if (!user) throw 'User not found';
      req.user = user;

      // If there is a clientId coming from the header, then use it
      // Otherwise use the clientId coming from the cookie
      if (clientIdFromCookie) {
        res.cookie('clientId', clientIdFromCookie);
        req.clientId = clientIdFromCookie;
      } else if (clientIdFromHeader) {
        res.cookie('clientId', clientIdFromHeader);
        req.clientId = clientIdFromHeader as string;
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Client ID is missing form the request cookie/header',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      next();
    } catch (e) {
      if (e instanceof HttpException) throw e;
      console.log(e);
      // Invalid user
      throw new UnauthorizedException();
    }
  }
}
