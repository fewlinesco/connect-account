import { MongoClient } from "mongodb";
import { NextApiResponse } from "next";
import { ExtendedRequest } from "src/@types/ExtendedRequest";

import { Handler } from "../@types/ApiPageHandler";
import { ExtendedGetServerSideProps } from "../@types/ExtendedGetServerSideProps";
import { config } from "../config";

const mongoClient = new MongoClient(config.connectMongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function withMongoDB(
//   handler: Handler | ExtendedGetServerSideProps,
// ): any {
//   if (handler.length === 2) {
//     return withApiPageMongoDB(handler as Handler);
//   } else {
//     return withGetServerSidePropsMongoDB(handler as ExtendedGetServerSideProps);
//   }
// }

// function withApiPageMongoDB(
//   handler: Handler,
// ): (request: ExtendedRequest, response: NextApiResponse) => void {
//   return async (
//     request: ExtendedRequest,
//     response: NextApiResponse,
//   ): Promise<void> => {
//     try {
//       if (!mongoClient.isConnected()) await mongoClient.connect();

//       request.mongoDb = mongoClient.db(config.connectMongoDbName);

//       await handler(request, response);
//     } finally {
//       await mongoClient.close();
//     }
//   };
// }

// function withGetServerSidePropsMongoDB(
//   handler: ExtendedGetServerSideProps,
// ): ExtendedGetServerSideProps {
//   return async (context) => {
//     try {
//       if (!mongoClient.isConnected()) await mongoClient.connect();

//       context.req.mongoDb = mongoClient.db(config.connectMongoDbName);

//       const props = await handler(context);

//       return props;
//     } finally {
//       await mongoClient.close();
//     }
//   };
// }

export function withMongoDB(
  handler: Handler,
): (request: ExtendedRequest, response: NextApiResponse) => void {
  return async (
    request: ExtendedRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    if (!mongoClient.isConnected()) await mongoClient.connect();

    request.mongoDb = mongoClient.db(config.connectMongoDbName);

    await handler(request, response);

    await mongoClient.close();
  };
}
