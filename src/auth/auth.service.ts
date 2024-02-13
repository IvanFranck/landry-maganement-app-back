import { Injectable } from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidatedUserEntity } from './entites/validate-user.entity';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { getExpiry } from 'src/utils/dateTimeUtilities';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './constants';

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

    const isPaswwordValid = await bcrypt.compare(
      validateUserDto.password,
      user.password,
    );

    if (user && isPaswwordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Handle user login, generate access and refresh tokens and set them to cookies.
   *
   * @param {Omit<User, 'password'>} user - description of parameter
   * @param {Response} response - description of parameter
   * @return {Promise<void>} undefined
   */
  async login(user: Omit<User, 'password'>, response: Response): Promise<void> {
    const { id, username, phone } = user;
    const payload = { sub: id, username, phone };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '2d' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    const accessTokenExpires = getExpiry(2, 'days');
    const refreshTokenExpires = getExpiry(7, 'days');

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      expires: accessTokenExpires,
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpires,
    });
  }

  async refreshToken() {}
}
