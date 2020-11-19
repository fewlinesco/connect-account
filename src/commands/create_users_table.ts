import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

import { config } from "../config";

const dynamoDbClient = new DynamoDBClient({
  region: config.dynamoDbRegion,
  endpoint: config.dynamoDbEndpoint,
});

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

    console.log("Table created:", data.TableDescription?.TableName);
  } catch (error) {
    console.log("Error:", error);
  }
}

createUsersTable();
