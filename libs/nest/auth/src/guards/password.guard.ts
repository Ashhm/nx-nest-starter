import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../enums';

@Injectable()
export class PasswordGuard extends AuthGuard(StrategyName.Password) {}
