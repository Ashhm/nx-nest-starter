import { UserRole } from '@libs/shared/enums';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
  aud?: string;
  iss?: string;
  jti?: string;

  [key: string]: unknown;
}
