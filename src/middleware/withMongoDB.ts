import { MongoClient } from "mongodb";
import { NextApiResponse } from "next";
import { ExtendedRequest } from "src/@types/ExtendedRequest";

import { Handler } from "../@types/ApiPageHandler";
import { config } from "../config";

const mongoClient = new MongoClient(config.connectMongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export function withMongoDB(
  handler: Handler,
): (request: ExtendedRequest, response: NextApiResponse) => void {
  return async (
    request: ExtendedRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    if (!mongoClient.isConnected()) {
      await mongoClient.connect();
    }

    request.mongoDb = mongoClient.db(config.connectMongoDbName);

    await handler(request, response);

    await mongoClient.close();
  };
}
