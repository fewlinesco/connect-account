import { Db } from "mongodb";

import { CommandResult } from "@src/@types/mongo/Commands";
import { MongoUser, TemporaryIdentity } from "@src/@types/mongo/User";

export async function insertTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
  mongoDb: Db,
): Promise<CommandResult> {
  mongoDb.collection("users").createIndex({ sub: 1 });

  const { result } = await mongoDb.collection<MongoUser>("users").updateOne(
    { sub },
    {
      $push: { temporaryIdentities: temporaryIdentity },
    },
  );

  return result;
}
