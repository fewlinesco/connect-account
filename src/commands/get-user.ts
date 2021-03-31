import { GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../configs/db-client";
import { configVariables } from "@src/configs/config-variables";

async function getUser(sub: string): Promise<GetItemCommandOutput> {
  const getItem = {
    TableName: configVariables.dynamoTableName,
    Key: {
      sub: { S: sub },
    },
  };

  return dynamoDbClient.send(new GetItemCommand(getItem));
}

export { getUser };
