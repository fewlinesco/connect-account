import { Db } from "mongodb";

import { oAuth2UserInfo, MongoUser } from "@lib/@types/mongo/User";
import { MongoInsertError } from "@src/errors";

export async function findOrInsertUser_deprecated(
  oauthUserInfo: oAuth2UserInfo,
  mongoDb: Db,
): Promise<string> {
  const { sub } = oauthUserInfo;

  mongoDb.collection("users").createIndex({ sub: 1 });

  const collection = mongoDb.collection<MongoUser>("users");

  const user = await collection.findOne({ sub });

  let documentId;

  if (user) {
    // Workaround to fix ClickUp task https://app.clickup.com/t/9yrj2g.
    const result = await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          accessToken: oauthUserInfo.accessToken,
          refresh_token: oauthUserInfo.refresh_token,
        },
      },
    );

    if (result.modifiedCount !== 1) {
      throw new MongoInsertError("User update failed");
    }

    documentId = user._id.toString();
  } else {
    const insertResult = await collection.insertOne(oauthUserInfo);

    if (insertResult.insertedCount === 0) {
      throw new MongoInsertError("User insertion failed");
    }

    documentId = insertResult.ops[0]._id.toString();
  }

  return documentId;
}
