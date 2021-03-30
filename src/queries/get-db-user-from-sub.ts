import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { DynamoUser, SudoEventId } from "@src/@types/dynamo-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { config } from "@src/configs/config-variables";
import { dynamoDbClient } from "@src/configs/db-client";

async function getDBUserFromSub(sub: string): Promise<DynamoUser | null> {
  const getItem = {
    TableName: config.dynamoTableName,
    Key: {
      sub: { S: sub },
    },
  };

  const { Item } = await dynamoDbClient.send(new GetItemCommand(getItem));

  if (Item) {
    const {
      sub,
      refresh_token,
      temporary_identities,
      sudo_event_ids,
    } = unmarshall(Item);

    return {
      sub: sub as string,
      refresh_token: refresh_token as string,
      temporary_identities: temporary_identities
        ? (temporary_identities as TemporaryIdentity[])
        : [],
      sudo_event_ids: sudo_event_ids ? (sudo_event_ids as SudoEventId[]) : [],
    };
  }

  return null;
}

export { getDBUserFromSub };
