import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";

import { config } from "../../src/configs/config-variables";
import { dynamoDbClient } from "../../src/configs/db-client";

async function deleteUsersTable(): Promise<void> {
  try {
    const deleteUsersTableCommand = new DeleteTableCommand({
      TableName: config.dynamoTableName,
    });
    const data = await dynamoDbClient.send(deleteUsersTableCommand);

    console.log("Table deleted:\n", data.TableDescription?.TableName);
  } catch (error) {
    console.log("Error while deleting `users` table:\n", error);
  }
}

deleteUsersTable();
