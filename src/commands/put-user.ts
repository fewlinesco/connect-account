import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, NativeAttributeValue } from "@aws-sdk/util-dynamodb";

import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { dynamoDbClient } from "@src/configs/db-client";

async function putUser(userData: {
  [key: string]: NativeAttributeValue;
}): Promise<PutItemCommandOutput> {
  const params = {
    TableName: CONFIG_VARIABLES.dynamoTableName,
    Item: marshall(userData),
  };

  const itemCommand = new PutItemCommand(params);

  return await dynamoDbClient.send(itemCommand);
}

export { putUser };
