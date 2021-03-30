import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, NativeAttributeValue } from "@aws-sdk/util-dynamodb";

import { config } from "@src/configs/config-variables";
import { dynamoDbClient } from "@src/configs/db-client";

async function putUser(userData: {
  [key: string]: NativeAttributeValue;
}): Promise<PutItemCommandOutput> {
  const params = {
    TableName: config.dynamoTableName,
    Item: marshall(userData),
  };

  const itemCommand = new PutItemCommand(params);

  return await dynamoDbClient.send(itemCommand);
}

export { putUser };
