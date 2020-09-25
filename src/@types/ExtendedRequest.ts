import { Db } from "mongodb";
import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export interface ExtendedRequest extends NextApiRequest {
  session: Session;
  mongoDb: Db;
}
