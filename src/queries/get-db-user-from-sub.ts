import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { DynamoUser, SudoEventId } from "@src/@types/dynamo-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { configVariables } from "@src/configs/config-variables";
import { dynamoDbClient } from "@src/configs/db-client";

async function getDBUserFromSub(sub: string): Promise<DynamoUser | null> {
  const getItem = {
    TableName: configVariables.dynamoTableName,
    Key: {
      sub: { S: sub },
    },
  };

  const { Item } = await dynamoDbClient.send(new GetItemCommand(getItem));

  if (Item) {
    const { sub, refresh_token, temporary_identities, sudo } = unmarshall(Item);

    let currentSudo;

    if (!sudo) {
      currentSudo = { sudo_mode_ttl: 0, sudo_event_ids: [] };
    } else {
      currentSudo = {
        sudo_mode_ttl: sudo.sudo_mode_ttl ? (sudo.sudo_mode_ttl as number) : 0,
        sudo_event_ids: sudo.sudo_event_ids
          ? (sudo.sudo_event_ids as SudoEventId[])
          : [],
      };
    }

    return {
      sub: sub as string,
      refresh_token: refresh_token as string,
      temporary_identities: temporary_identities
        ? (temporary_identities as TemporaryIdentity[])
        : [],
      sudo: currentSudo,
    };
  }

  return null;
}

export { getDBUserFromSub };
