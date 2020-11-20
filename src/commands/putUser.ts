import { PutItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";

export type DbUser = {
  sub: {
    S: string;
  };
};

export async function putUser(Item: DbUser): Promise<void> {
  try {
    const params = {
      TableName: "users",
      Item,
    };

    const itemCommand = new PutItemCommand(params);

    const data = await dynamoDbClient.send(itemCommand);

    console.log("Put command succeed.\nData sent back:", data);
  } catch (error) {
    console.error("Put command failed:", error);
  }
}
