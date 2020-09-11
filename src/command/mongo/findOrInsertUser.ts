import { ObjectId } from "mongodb";

import { oAuth2UserInfo, MongoUser } from "../../@types/mongo/User";
import { mongoClient } from "../../config";

export async function findOrInsertUser(
  oauthUserInfo: oAuth2UserInfo,
): Promise<{ documentId: string }> {
  const { sub } = oauthUserInfo;

  const connectedClient = await mongoClient.connect();
  const db = connectedClient.db("connect-account-dev");
  const collection = db.collection<MongoUser>("users");

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

  connectedClient.close();
  return { documentId };
}
