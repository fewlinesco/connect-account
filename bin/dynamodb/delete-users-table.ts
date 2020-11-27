import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../../src/dbClient";
import { config } from "@src/config";

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
