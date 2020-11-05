import { Db, ObjectId } from "mongodb";

import { MongoUpdateError } from "@src/errors";

export async function updateAccessAndRefreshTokens(
  mongoDb: Db,
  userDocumentId: string,
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const { result } = await mongoDb
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userDocumentId) },
      { $set: { accessToken, refreshToken } },
    );

  if (result.n === 0) {
    throw new MongoUpdateError("Mongo update failed");
  }
}
