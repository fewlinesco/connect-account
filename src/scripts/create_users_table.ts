import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

import { dynamoDbClient } from "../dbClient";

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
    const data = await dynamoDbClient.send(
      new CreateTableCommand(usersTableSchema),
    );

    console.log("Table created:\n", data.TableDescription?.TableName);
  } catch (error) {
    console.log("Error while creating `users` table:\n", error);
  }
}

createUsersTable();
