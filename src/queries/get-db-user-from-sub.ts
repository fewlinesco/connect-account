import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { DynamoUser } from "@src/@types/dynamo-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { config } from "@src/config";
import { dynamoDbClient } from "@src/db-client";

async function getDBUserFromSub(sub: string): Promise<DynamoUser | null> {
  try {
    const getItem = {
      TableName: config.dynamoTableName,
      Key: {
        sub: { S: sub },
      },
    };

    const { Item } = await dynamoDbClient.send(new GetItemCommand(getItem));

    if (Item) {
      const { sub, refresh_token, temporary_identities } = unmarshall(Item);
      return {
        sub: sub as string,
        refresh_token: refresh_token as string,
        temporary_identities: temporary_identities
          ? (temporary_identities as TemporaryIdentity[])
          : [],
      };
    }

    return null;
  } catch (error) {
    console.log("Error while getting the user:\n");
    throw error;
  }
}

export { getDBUserFromSub };
