import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { CONFIG_VARIABLES } from "./config-variables";

const dynamoDbClient = new DynamoDBClient({
  region: CONFIG_VARIABLES.dynamoRegion,
  endpoint: CONFIG_VARIABLES.dynamoDbEndpoint,
  credentials: {
    accessKeyId: CONFIG_VARIABLES.dynamoAccessKeyID,
    secretAccessKey: CONFIG_VARIABLES.dynamoSecretAccessKey,
  },
});

export { dynamoDbClient };
