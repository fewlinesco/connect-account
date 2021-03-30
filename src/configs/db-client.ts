import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { config } from "./config-variables";

const dynamoDbClient = new DynamoDBClient({
  region: config.dynamoRegion,
  endpoint: config.dynamoDbEndpoint,
  credentials: {
    accessKeyId: config.dynamoAccessKeyID,
    secretAccessKey: config.dynamoSecretAccessKey,
  },
});

export { dynamoDbClient };
