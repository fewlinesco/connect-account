import { GetItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "@src/dbClient";

export async function getDBUserFromSub(
  sub: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    const getItem = {
      TableName: "users",
      Key: {
        sub: { S: sub },
      },
    };

    const { Item } = await dynamoDbClient.send(new GetItemCommand(getItem));

    return Item;
  } catch (error) {
    console.log("Error while getting the user:\n");
    throw error;
  }
}
