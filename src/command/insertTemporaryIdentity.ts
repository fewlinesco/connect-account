import { ObjectId, Db } from "mongodb";

import { MongoUser, TemporaryIdentity } from "@src/@types/mongo/User";
import { MongoInsertError } from "@src/errors";

export async function insertTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
  mongoDb: Db,
): Promise<string> {
  mongoDb.collection("users").createIndex({ sub: 1 });

  const collection = mongoDb.collection<MongoUser>("users");

  const user = await collection.updateOne();

  let documentId;

  if (!user) {
    const insertResult = await collection.insertOne(oauthUserInfo);
    if (insertResult.insertedCount === 0) {
      throw new MongoInsertError("User insertion failed");
    }

    documentId = insertResult.ops[0]._id.toString();
  } else {
    documentId = (user._id as ObjectId).toString();
  }

  return documentId;
}
