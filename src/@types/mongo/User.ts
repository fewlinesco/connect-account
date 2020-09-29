import { ObjectId } from "mongodb";

export type oAuth2UserInfo = {
  sub: string;
  accessToken: string;
  refreshToken: string;
};

export type TemporaryIdentity = {
  eventId: string;
  value: string;
  type: string;
  expiresAt: number;
};

export type MongoUser = {
  _id?: ObjectId;
  sub: string;
  accessToken: string;
  refreshToken: string;
  locale?: string;
  temporaryIdentities?: TemporaryIdentity[];
};
