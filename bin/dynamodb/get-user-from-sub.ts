import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { CONFIG_VARIABLES } from "../../src/configs/config-variables";
import { dynamoDbClient } from "../../src/configs/db-client";

const errors = {
  emptyArgs: "Please provide the `sub` of the user you are looking for.",
  tooManyArgs: "This script expect only on argument: the user `sub`.",
  commandFailed: "Error while getting the user:\n",
};

async function getUserFromSub(): Promise<void> {
  try {
    const [, , ...args] = process.argv;

    if (args.length > 0) {
      if (args.length === 1) {
        const getItem = {
          TableName: CONFIG_VARIABLES.dynamoTableName,
          Key: {
            sub: { S: args[0] },
          },
        };
        const data = await dynamoDbClient.send(new GetItemCommand(getItem));

        console.log("\nUser:\n", data);

        const { Item } = data;
        if (Item) {
          console.log("\nUser data:\n", unmarshall(Item));
          console.log(
            "\nTemporary Identities:\n",
            unmarshall(Item).temporary_identities,
          );
          console.log("\nSudo:\n", unmarshall(Item).sudo);
        }
      } else {
        throw new Error(errors.tooManyArgs);
      }
    } else {
      throw new Error(errors.emptyArgs);
    }
  } catch (error) {
    console.log(errors.commandFailed);
    throw error;
  }
}

getUserFromSub();
