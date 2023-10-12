export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  aud?: string;
  iss?: string;
  jti?: string;

  [key: string]: unknown;
}
