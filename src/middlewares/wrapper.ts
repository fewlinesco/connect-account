import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { Handler } from "@src/@types/ApiPageHandler";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";

type Middleware = (handler: Handler) => Handler;

export function wrapMiddlewares(
  middlewares: Middleware[],
  handler: Handler,
): Handler {
  for (const middleware of middlewares.reverse()) {
    handler = middleware(handler);
  }

  return handler;
}

export async function wrapMiddlewaresForSSR<P>(
  context: GetServerSidePropsContext,
  middlewares: Middleware[],
  handler: Handler = () => Promise.resolve(),
): Promise<GetServerSidePropsResult<P>> {
  const result = await wrapMiddlewares(middlewares, handler)(
    context.req as ExtendedRequest,
    context.res,
  );
  return result ? result : { props: {} };
}
