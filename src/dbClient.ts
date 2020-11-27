import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { config } from "./config";

export const dynamoDbClient = new DynamoDBClient({
  region: config.dynamoDbRegion,
  endpoint: config.dynamoDbEndpoint,
  credentials: {
    accessKeyId: config.dynamoAccessKeyID,
    secretAccessKey: config.dynamoSecretAccessKey,
  },
});
