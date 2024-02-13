import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    await this.authService.login(req.user, response);
    response.send(req.user);
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
