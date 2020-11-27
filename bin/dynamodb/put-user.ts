import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, NativeAttributeValue } from "@aws-sdk/util-dynamodb";

import { config } from "../../src/config";
import { dynamoDbClient } from "../../src/dbClient";

export async function putUser(userData: {
  [key: string]: NativeAttributeValue;
}): Promise<void> {
  try {
    const Item = marshall(userData);
    const params = {
      TableName: config.dynamoTableName,
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
  sub: "sub",
  refresh_token: "refresh_token",
  id_token: "id_token",
  temporary_identities: [
    {
      event_id: "event_id",
      value: "value",
      type: "type",
      expires_at: 42,
    },
  ],
};

putUser(Item);
