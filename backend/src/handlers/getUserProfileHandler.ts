import { Tracer } from "@fewlines/fwl-tracing";
import {
  HandlerPromise,
  HttpStatus,
  RejectFunction,
  ResolveFunction,
  UnmanagedError,
} from "@fewlines/fwl-web";
import { UsersProfileApiRequestFactory } from "../../test/clients/connect-profile/apis/UsersProfileApi";
import { createConfiguration } from "../../test/clients/connect-profile/index";
// import {
//   UsersProfileApi,
//   Configuration,
// } from "../../test/clients/connect-profile-axios/index";
import config from "../config";

export function handler() {
  return (
    tracer: Tracer,
    resolve: ResolveFunction,
    reject: RejectFunction
  ): HandlerPromise => {
    return tracer.span("test-openapi-client", async () => {
      try {
        // `typescript` preset.
        const configurationParameters = {
          authMethods: { api_key: `API_KEY ${config.connectProfile.apiKey}` },
        };
        const clientConfig = createConfiguration(configurationParameters);
        const connectProfileClient = new UsersProfileApiRequestFactory(clientConfig);
        const data = await connectProfileClient.getUserBySub("foo");
        console.log(data);

        // `typescript-axios` preset.
        // const clientConfig = new Configuration({ apiKey: `API_KEY ${config.connectProfile.apiKey}` });
        // const connectProfileClient = new UsersProfileApi(clientConfig);

        // const {data} = await connectProfileClient.getUserBySub("foo");

        return resolve(HttpStatus.OK, {});
      } catch (error) {
        console.log(error);
        return reject(UnmanagedError());
      }
    });
  };
}
