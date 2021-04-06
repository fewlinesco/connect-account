import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { configVariables } from "./config-variables";

const dynamoDbClient = new DynamoDBClient({
  region: configVariables.dynamoRegion,
  endpoint: configVariables.dynamoDbEndpoint,
  credentials: {
    accessKeyId: configVariables.dynamoAccessKeyID,
    secretAccessKey: configVariables.dynamoSecretAccessKey,
  },
});

export { dynamoDbClient };
