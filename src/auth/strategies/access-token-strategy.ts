import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_STRATEGY_NAME,
  JWT_CONSTANT,
} from '../constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          console.log('req.cookies: ', req.cookies);
          if (req && req.cookies) {
            token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    console.log('payload jwt strategy', payload);
    return { userId: 90 };
  }
}
