import { MongoClient, Db } from "mongodb";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export type ExtendedGetServerSideProps<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: ExtendedGetServerSidePropsContext<Q>,
) => Promise<GetServerSidePropsResult<P>>;

export type ExtendedGetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GetServerSidePropsContext<Q> & {
  mongoDbClient?: MongoClient;
  mongoDb?: Db;
};
