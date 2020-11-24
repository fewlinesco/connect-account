import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, NativeAttributeValue } from "@aws-sdk/util-dynamodb";

import { dynamoDbClient } from "@src/dbClient";

export async function putUser(Item: {
  [key: string]: NativeAttributeValue;
}): Promise<PutItemCommandOutput> {
  try {
    const params = {
      TableName: "users",
      Item: marshall(Item),
    };

    const itemCommand = new PutItemCommand(params);

    return dynamoDbClient.send(itemCommand);
  } catch (error) {
    console.log("Put command failed:\n");
    throw error;
  }
}
