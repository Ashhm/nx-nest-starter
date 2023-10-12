import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../enums';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyName.RefreshToken) {}
