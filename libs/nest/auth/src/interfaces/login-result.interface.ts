import { TokenType } from '@libs/shared/enums';

export interface AuthResult {
  type: TokenType;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
}
