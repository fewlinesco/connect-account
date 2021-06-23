import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

async function settingSudoTTL(): Promise<void> {
  if (process.env.CONNECT_TEST_ACCOUNT_SUB === undefined) {
    throw new Error(
      "CONNECT_TEST_ACCOUNT_SUB environment variable is undefined",
    );
  }

  if (process.env.DYNAMODB_TABLE_NAME === undefined) {
    throw new Error("DYNAMODB_TABLE_NAME environment variable is undefined");
  }

  if (process.env.DYNAMODB_REGION === undefined) {
    throw new Error("DYNAMODB_REGION environment variable is undefined");
  }

  if (process.env.DYNAMODB_ENDPOINT === undefined) {
    throw new Error("DYNAMODB_ENDPOINT environment variable is undefined");
  }

  if (process.env.DYNAMODB_ACCESS_KEY_ID === undefined) {
    throw new Error("DYNAMODB_ACCESS_KEY_ID environment variable is undefined");
  }

  if (process.env.DYNAMODB_SECRET_ACCESS_KEY === undefined) {
    throw new Error(
      "DYNAMODB_SECRET_ACCESS_KEY environment variable is undefined",
    );
  }

  const dynamoDbClient = new DynamoDBClient({
    region: process.env.DYNAMODB_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    },
  });

  const itemCommand = new PutItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall({
      sub: process.env.CONNECT_TEST_ACCOUNT_SUB,
      sudo: {
        sudo_mode_ttl: Date.now() + 300000,
      },
    }),
  });
  await dynamoDbClient.send(itemCommand);

  const { Item } = await dynamoDbClient.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        sub: { S: process.env.CONNECT_TEST_ACCOUNT_SUB },
      },
    }),
  );

  if (Item) {
    const user = unmarshall(Item);

    console.log(user);
  }
  return;
}

settingSudoTTL();
