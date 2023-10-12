import { PartialType, PickType } from '@nestjs/swagger';
import { RefreshTokenDto } from './refresh-token.dto';

export class FindRefreshTokenDto extends PartialType(PickType(RefreshTokenDto, ['userId', 'deviceId', 'token'])) {}
