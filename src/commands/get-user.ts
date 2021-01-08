import { GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";
import { config } from "@src/config";

export async function getUser(sub: string): Promise<GetItemCommandOutput> {
  const getItem = {
    TableName: config.dynamoTableName,
    Key: {
      sub: { S: sub },
    },
  };

  return dynamoDbClient.send(new GetItemCommand(getItem));
}
