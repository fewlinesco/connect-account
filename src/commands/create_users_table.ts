import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "@src/dbClient";

const usersTableSchema = {
  TableName: "users",
  KeySchema: [{ AttributeName: "sub", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "sub", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

async function createUsersTable(): Promise<void> {
  try {
    const usersTable = new CreateTableCommand(usersTableSchema);
    const data = await dynamoDbClient.send(usersTable);

    console.log("`users` table created:", data.TableDescription?.TableName);
  } catch (error) {
    console.log("Error while creating `users` table:", error);
  }
}

createUsersTable();
