import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT, REFRESH_TOKEN_COOKIE_NAME } from '../constants';
import { Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../constants/index';
import { JWTDecodedEntity } from '../entites/jwt-decoded-payload.entity';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.PUBLIC_KEY,
    });
  }

  async validate(payload: JWTDecodedEntity) {
    const { sub, phone, username, signUpCompleted } = payload;
    return { sub, phone, username, signUpCompleted };
  }
}
