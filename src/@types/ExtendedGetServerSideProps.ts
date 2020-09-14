import { IncomingMessage, ServerResponse } from "http";
import { Db } from "mongodb";
import { GetServerSidePropsResult } from "next";
import { Session } from "next-iron-session";
import { ParsedUrlQuery } from "querystring";

export type ExtendedGetServerSideProps<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: ExtendedGetServerSidePropsContext<Q>,
) => Promise<GetServerSidePropsResult<P>>;

export type ExtendedGetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = {
  req: IncomingMessage & { session: Session; mongoDb: Db };
  res: ServerResponse;
  params?: Q;
  query: ParsedUrlQuery;
  preview?: boolean;
  previewData?: any;
};
