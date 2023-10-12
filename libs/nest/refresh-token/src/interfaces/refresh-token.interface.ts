export interface RefreshToken {
  id: string;
  userId: string;
  deviceId: string; // unique key for each refresh token
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
