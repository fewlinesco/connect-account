import { PutItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";

export type DbUser = {
  sub: {
    S: string;
  };
};

export async function putUserToDB(Item: DbUser): Promise<void> {
  try {
    const params = {
      TableName: "users",
      Item,
    };

    const itemCommand = new PutItemCommand(params);

    const data = await dynamoDbClient.send(itemCommand);

    console.log("Put command succeed. Data:", data);
  } catch (error) {
    console.error("Put command failed:", error);
  }
}

const Item = {
  sub: { S: "foo" },
};

putUserToDB(Item);
