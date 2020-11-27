import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "@src/config";
import { dynamoDbClient } from "@src/dbClient";

export async function getDBUserFromSub(
  sub: string,
): Promise<Record<string, unknown> | null> {
  try {
    const getItem = {
      TableName: config.dynamoTableName,
      Key: {
        sub: { S: sub },
      },
    };

    const { Item } = await dynamoDbClient.send(new GetItemCommand(getItem));

    if (Item) {
      return unmarshall(Item);
    }

    return null;
  } catch (error) {
    console.log("Error while getting the user:\n");
    throw error;
  }
}
