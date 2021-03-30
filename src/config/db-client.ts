import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { config } from "../config";

const dynamoDbClient = new DynamoDBClient({
  region: config.dynamoRegion,
  endpoint: config.dynamoDbEndpoint,
  credentials: {
    accessKeyId: config.dynamoAccessKeyID,
    secretAccessKey: config.dynamoSecretAccessKey,
  },
});

export { dynamoDbClient };
