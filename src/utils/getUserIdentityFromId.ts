import { IncomingMessage } from "http";
import { GetServerSidePropsContext } from "next";

type ServerRouter = {
  route: string;
  pathname: string;
  query: Record<string, unknown>;
  asPath: string;
  basePath: string;
  events: any;
  isFallback: boolean;
};

export async function getUserIdentityFromId(
  context: GetServerSidePropsContext,
): Promise<void> {
  const serverRouter: ServerRouter = (context.req as IncomingMessage & {
    ServerRouter: ServerRouter;
  }).ServerRouter;
  console.log(serverRouter);

  serverRouter && console.log(serverRouter.query.id);
}
