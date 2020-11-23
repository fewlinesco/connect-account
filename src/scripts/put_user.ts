import { PutItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";

type DbUser = {
  sub: {
    S: string;
  };
  refresh_token: {
    S: string;
  };
};

type DbUserWithIdToken = {
  id_token: {
    S: string;
  };
} & DbUser;

export async function putUser(Item: DbUser | DbUserWithIdToken): Promise<void> {
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

const Item = {
  sub: {
    S: "foo",
  },
  refresh_token: { S: "bar" },
};

putUser(Item);
