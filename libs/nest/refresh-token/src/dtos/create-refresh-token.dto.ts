import { PickType } from '@nestjs/swagger';
import { RefreshTokenDto } from './refresh-token.dto';

export class CreateRefreshTokenDto extends PickType(RefreshTokenDto, ['userId', 'deviceId', 'expiresAt', 'token']) {}
