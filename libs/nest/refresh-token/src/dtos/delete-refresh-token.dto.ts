import { PartialType, PickType } from '@nestjs/swagger';
import { RefreshTokenDto } from './refresh-token.dto';

export class DeleteRefreshTokenDto extends PartialType(
  PickType(RefreshTokenDto, ['userId', 'deviceId', 'expiresAt'] as const),
) {}
