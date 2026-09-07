export interface JwtPayload {
  sub: string; // userId
  factoryId: string;
  role: string;
  jti: string;
}

export interface AuthenticatedUser {
  userId: string;
  factoryId: string;
  role: string;
  jti: string;
}
