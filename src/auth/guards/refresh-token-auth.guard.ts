import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../constants';

export class RefreshTokenAuthGuard extends AuthGuard(
  REFRESH_TOKEN_STRATEGY_NAME,
) {}
