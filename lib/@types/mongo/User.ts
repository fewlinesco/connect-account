import { ObjectId } from "mongodb";

export type oAuth2UserInfo = {
  sub: string;
  accessToken: string;
  refresh_token: string;
  id_token?: string;
};

export type TemporaryIdentity = {
  eventId: string;
  value: string;
  type: string;
  expiresAt: number;
};

export type MongoUser = {
  _id: ObjectId;
  sub: string;
  accessToken: string;
  refresh_token: string;
  id_token?: string;
  locale?: string;
  temporaryIdentities?: TemporaryIdentity[];
};
