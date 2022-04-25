import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'src/helpers/constant';

dotenv.config();

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req: Request & { user: any }, res: Response, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;
    if (authorization) {
      const token = authorization.split(' ')[1];
      try {
        const decryptData = await JWT.verify(token, process.env.TOKEN_SECRET);
        req.user = decryptData;
        return next();
      } catch (error) {
        // throw token expired error
        if (error.name === 'TokenExpiredError') {
          return next(new BadRequestException(constants.TOKEN_EXPIRED));
        }
        console.log('Error in token decryption', error);
        return next(new InternalServerErrorException(constants.TOKEN_MISSING));
      }
    }
    next(new BadRequestException(constants.TOKEN_MISSING));
  }
}
