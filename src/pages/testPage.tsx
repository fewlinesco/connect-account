import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import { HttpVerbs } from "../@types/HttpVerbs";
import { AccessToken } from "../@types/oauth2/OAuth2Tokens";
import { oauth2Client, config } from "../config";
import { OAuth2Error } from "../errors";
import { useCookies } from "../hooks/useCookies";
import { withSSRLogger } from "../middleware/withSSRLogger";
import withSession from "../middleware/withSession";
import { fetchJson } from "../utils/fetchJson";
import Sentry, { addRequestScopeToSentry } from "../utils/sentry";

const TestPage: React.FC = () => {
  const { data, error } = useCookies();

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <button
      onClick={async () => {
        return fetchJson("/api/auth-connect/db-user", HttpVerbs.POST, {
          userId: data.userSub,
        }).catch((error: Error) => {
          throw error;
        });
      }}
    >
      TEST
    </button>
  );
};

export default TestPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const accessToken = context.req.session.get("user-sub");

      if (accessToken) {
        await oauth2Client.verifyJWT<AccessToken>(
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
