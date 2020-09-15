import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { fetchJson } from "src/utils/fetchJson";
import styled from "styled-components";

import { HttpVerbs } from "../../@types/HttpVerbs";
import { oauth2Client, config } from "../../config";
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
      const userDocumentId = context.req.session.get("user-session-id");

      const route = "/api/auth-connect/get-user";
      const absoluteURL = config.connectDomain + route;

      const { user } = await fetch(absoluteURL).then((response) =>
        response.json(),
      );

      if (user) {
        await oauth2Client
          .verifyJWT(user.accessToken, config.connectJwtAlgorithm)
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const body = {
                userDocumentId,
                refreshToken: user.refreshToken,
                redirectUrl: context.req.url as string,
              };

              const route = "/api/oauth/refresh-token";
              const absoluteURL = config.connectDomain + route;

              await fetchJson(absoluteURL, HttpVerbs.POST, body);

              context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
              context.res.setHeader(
                "location",
                context.req.headers.referer || "/",
              );
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
