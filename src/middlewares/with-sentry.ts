import { Handler } from "@src/@types/core/handler";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

export function withSentry(handler: Handler): Handler {
  return async (request, response) => {
    addRequestScopeToSentry(request);

    try {
      return await handler(request, response);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag(request.url || "/", error.name);
        Sentry.captureException(error);
      });

      throw error;
    }
  };
}
