import { MongoClient } from "mongodb";
import { NextApiResponse } from "next";

import { Handler } from "@src/@types/ApiPageHandler";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { config } from "@src/config";

let mongoClient: MongoClient;

const mongoPool = new MongoClient(config.connectMongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getMongoClient(): Promise<MongoClient> {
  if (mongoClient) {
    return Promise.resolve(mongoClient);
  }

  return new Promise((resolve) => {
    mongoPool.connect().then((client) => {
      mongoClient = client;

      resolve(mongoClient);
    });
  });
}

export function withMongoDB(
  handler: Handler,
): (request: ExtendedRequest, response: NextApiResponse) => void {
  return async (
    request: ExtendedRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    request.mongoDb = (await getMongoClient()).db(config.connectMongoDbName);

    await handler(request, response);
  };
}
