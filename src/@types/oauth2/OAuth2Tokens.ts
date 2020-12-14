export type AccessToken = {
  aud: string | string[];
  exp: number;
  iss: string;
  scope: string;
  sub: string;
};

export type RefreshTokenResponse = {
  refresh_token: string;
  access_token: string;
};
