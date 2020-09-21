import { Db } from "mongodb";

import { MongoUser, TemporaryIdentity } from "@src/@types/mongo/User";
import { MongoInsertError } from "@src/errors";

export async function insertTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
  mongoDb: Db,
): Promise<void> {
  mongoDb.collection("users").createIndex({ sub: 1 });

  const updateResult = await mongoDb.collection<MongoUser>("users").updateOne(
    { sub },
    {
      $push: { temporaryIdentities: temporaryIdentity },
    },
  );

  console.log({ updateResult });
}
