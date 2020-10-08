import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { oauth2Client, config } from "@src/config";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const AccountIndexPage: React.FC = () => {
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

export default AccountIndexPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const userDocumentId = context.req.session.get("user-session-id");

      const user = await getUser(context.req.headers["cookie"]);

      if (user) {
        await oauth2Client
          .verifyJWT(user.accessToken, config.connectJwtAlgorithm)
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const body = {
                userDocumentId,
                refreshToken: user.refreshToken,
              };

              await refreshTokens(body);

              context.res.end();
            } else {
              throw error;
            }
          });
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
  padding-top: ${({ theme }) => theme.spaces.xxs};
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const AccountCard = styled.div`
  padding: ${({ theme }) => theme.spaces.xs};
  border-bottom: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};
`;
