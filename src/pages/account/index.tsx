import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { oauth2Client, config } from "../../config";
import { OAuth2Error } from "../../errors";
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
      const accessToken = context.req.session.get("user-jwt");

      if (accessToken) {
        console.log(accessToken);
        await oauth2Client.verifyJWT<{ sub: string }>(
          accessToken,
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
      if (error instanceof OAuth2Error) {
        Sentry.withScope((scope) => {
          scope.setTag(
            "/pages/account/logins SSR",
            "/pages/account/logins SSR",
          );
          Sentry.captureException(error);
        });

        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }

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
