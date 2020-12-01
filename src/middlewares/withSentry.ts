import { ServerResponse } from "http";

import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

export function withSentry(handler: Handler): Handler {
  return async (request: ExtendedRequest, response: ServerResponse) => {
    addRequestScopeToSentry(request);

    try {
      return handler(request, response);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag(request.url || "/", error.name);
        Sentry.captureException(error);
      });

      throw error;
    }
  };
}
