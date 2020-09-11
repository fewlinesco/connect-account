import { HttpStatus } from "@fwl/web";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { MongoUser } from "../../@types/mongo/User";
import { oauth2Client, config, mongoClient } from "../../config";
import { withSSRLogger } from "../../middleware/withSSRLogger";
import withSession from "../../middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "../../utils/sentry";

const Account: React.FC = () => {
  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <AccountBox>
        <AccountCard>
          <Link href="/account/logins">
            <a>Logins</a>
          </Link>
        </AccountCard>
      </AccountBox>
    </>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const _id = context.req.session.get("user-document-id");

      const connectedClient = await mongoClient.connect();
      const db = connectedClient.db("connect-account-dev");
      const collection = db.collection<MongoUser>("users");

      const user = await collection.findOne({ _id: new ObjectId(_id) });
      connectedClient.close();

      if (_id && user) {
        await oauth2Client.verifyJWT(
          user.accessToken,
          config.connectJwtAlgorithm,
        );
      } else {
        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();
      }

      return {
        props: {},
      };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag("/pages/account/ SSR", error.name);
        Sentry.captureException(error);
      });

      context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      context.res.setHeader("location", context.req.headers.referer || "/");
      context.res.end();

      throw error;
    }
  }),
);

const AccountBox = styled.div`
  width: 100rem;
  padding-top: ${({ theme }) => theme.spaces.component.xxs};
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const AccountCard = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
  border-bottom: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};
`;
