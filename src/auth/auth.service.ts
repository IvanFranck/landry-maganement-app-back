import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidatedUserEntity } from './entites/validate-user.entity';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { getExpiry } from '@common/utils/dateTimeUtilities';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './constants';
import { RefreshTokenGuardDto } from './dto/refresh-token-guard.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * validate user based on phone and password.
   *
   * @param {ValidateUserDto} validateUserDto - the user data to be validated
   * @return {Promise<ValidatedUserEntity | null>} the result of the user validation
   */
  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidatedUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: validateUserDto.phone,
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPaswwordValid = await bcrypt.compare(
      validateUserDto.password,
      user.password,
    );

    if (!isPaswwordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  /**
   * Handle user login, generate access and refresh tokens and set them to cookies.
   *
   * @param {Omit<User, 'password'>} user - description of parameter
   * @param {Response} response - description of parameter
   * @return {Promise<void>} undefined
   */
  async login(user: Omit<User, 'password'>, response: Response): Promise<void> {
    const { id, username, phone, signUpCompleted } = user;
    const payload = { sub: id, username, phone, signUpCompleted };

    const [accessToken, refreshToken] = await this.getTokens(payload);
    const [accessTokenExpires, refreshTokenExpires] = this.getExpiries();

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      expires: accessTokenExpires,
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpires,
    });
  }

  async refreshToken(user: RefreshTokenGuardDto, response: Response) {
    const [accessToken, refreshToken] = await this.getTokens(user);
    const [accessTokenExpires, refreshTokenExpires] = this.getExpiries();

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      expires: accessTokenExpires,
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpires,
    });
  }

  /**
   * Asynchronously retrieves tokens for the given payload.
   *
   * @param {{ sub: number; username: string; phone: number }} payload - the payload containing sub, username, and phone
   * @return {Promise<string[]>} an array of tokens as a promise
   */
  async getTokens(payload: {
    sub: number;
    username: string;
    phone: number;
  }): Promise<string[]> {
    return await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '2d' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
  }

  /**
   * retrieves an array of expiry dates.
   *
   * @return {Date[]} an array of dates
   */
  getExpiries(): Date[] {
    return [getExpiry(2, 'days'), getExpiry(7, 'days')];
  }
}
