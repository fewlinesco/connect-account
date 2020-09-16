import { ObjectId, Db } from "mongodb";

import { oAuth2UserInfo, MongoUser } from "@src/@types/mongo/User";

export async function findOrInsertUser(
  oauthUserInfo: oAuth2UserInfo,
  mongoDb: Db,
): Promise<string> {
  const { sub } = oauthUserInfo;

  mongoDb.collection("users").createIndex({ sub: 1 });

  const collection = mongoDb.collection<MongoUser>("users");

  const user = await collection.findOne({ sub });

  let documentId;

  if (!user) {
    const insertResult = await collection.insertOne(oauthUserInfo);
    if (insertResult.insertedCount === 0) {
      throw new Error("User insertion failed");
    }

    documentId = insertResult.ops[0]._id.toString();
  } else {
    documentId = (user._id as ObjectId).toString();
  }

  return documentId;
}
