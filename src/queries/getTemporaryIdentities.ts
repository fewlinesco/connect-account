import { Db } from "mongodb";

import { MongoUser } from "@src/@types/mongo/User";

export async function getTemporaryIdentities(
  eventId: string,
  mongoDb: Db,
): Promise<MongoUser[]> {
  return mongoDb
    .collection("users")
    .find<MongoUser>({
      "temporaryIdentities.eventId": { $eq: eventId },
    })
    .toArray();
}
