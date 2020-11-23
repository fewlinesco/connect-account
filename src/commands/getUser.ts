import { GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";

export async function getUser(sub: string): Promise<GetItemCommandOutput> {
  const getItem = {
    TableName: "users",
    Key: {
      sub: { S: sub },
    },
  };

  return dynamoDbClient.send(new GetItemCommand(getItem));
}
