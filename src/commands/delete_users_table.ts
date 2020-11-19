import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "@src/dbClient";

async function deleteUsersTable(): Promise<void> {
  try {
    const deleteUsersTableCommand = new DeleteTableCommand({
      TableName: "users",
    });
    const data = await dynamoDbClient.send(deleteUsersTableCommand);
    console.log("`users` table deleted:", data.TableDescription?.TableName);
  } catch (error) {
    console.log("Error while deleting `users` table:", error);
  }
}

deleteUsersTable();
