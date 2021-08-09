import {
  CreateTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

import { CONFIG_VARIABLES } from "../../src/configs/config-variables";
import { dynamoDbClient } from "../../src/configs/db-client";

const usersTableSchema = {
  TableName: CONFIG_VARIABLES.dynamoTableName,
  KeySchema: [{ AttributeName: "sub", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "sub", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

async function createUsersTable(): Promise<void> {
  try {
    const listTable = await dynamoDbClient.send(new ListTablesCommand({}));

    if (listTable.TableNames?.includes(usersTableSchema.TableName)) {
      return console.log(
        `Table '${usersTableSchema.TableName}' already created.`,
      );
    }

    const data = await dynamoDbClient.send(
      new CreateTableCommand(usersTableSchema),
    );

    console.log(`Table created: ${data.TableDescription?.TableName}.`);
  } catch (error) {
    console.log("Error while creating `users` table:\n", error);
  }
}

createUsersTable();
