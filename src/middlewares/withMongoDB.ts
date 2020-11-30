import { ServerResponse } from "http";
import { MongoClient } from "mongodb";

import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { config } from "@src/config";

let mongoClient: MongoClient;

const mongoPool = new MongoClient(config.connectMongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function getMongoClient(): Promise<MongoClient> {
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

export function withMongoDB(handler: Handler): Handler {
  return async (
    request: ExtendedRequest,
    response: ServerResponse,
  ): Promise<void> => {
    request.mongoDb = (await getMongoClient()).db(config.connectMongoDbName);

    return handler(request, response);
  };
}
