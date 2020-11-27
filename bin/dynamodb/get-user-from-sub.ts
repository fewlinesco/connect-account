import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../src/config";
import { dynamoDbClient } from "../../src/dbClient";

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
          TableName: config.dynamoTableName,
          Key: {
            sub: { S: args[0] },
          },
        };
        const data = await dynamoDbClient.send(new GetItemCommand(getItem));

        console.log("User:\n", data);

        const { Item } = data;
        Item && console.log("User data:\n", unmarshall(Item));
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
