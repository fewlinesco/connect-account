export type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
};

export type TemporaryIdentity = {
  event_id: string;
  value: string;
  type: string;
  expires_at: number;
};
