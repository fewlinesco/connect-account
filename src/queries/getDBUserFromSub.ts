import { GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "@src/dbClient";

export async function getDBUserFromSub(
  sub: string,
): Promise<GetItemCommandOutput> {
  try {
    const getItem = {
      TableName: "users",
      Key: {
        sub: { S: sub },
      },
    };

    return dynamoDbClient.send(new GetItemCommand(getItem));
  } catch (error) {
    console.log("Error while getting the user:\n");
    throw error;
  }
}
