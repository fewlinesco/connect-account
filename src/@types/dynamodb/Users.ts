export type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
};

export type TemporaryIdentity = {
  eventId: string;
  value: string;
  type: string;
  expiresAt: number;
};
