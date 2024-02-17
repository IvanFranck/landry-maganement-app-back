import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({ description: 'user logged in' })
  @ApiUnauthorizedResponse({ description: 'informations incorrectes' })
  async login(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    await this.authService.login(req.user, response);
    response.send({
      message: 'user logged in',
      user: req.user,
    });
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.refreshToken(req.user, response);
    response.send({ message: 'token refreshed', user: { ...req.user } });
  }
}
