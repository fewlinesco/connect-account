import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@src/components/Layout";
import { Locale } from "@src/components/display/fewlines/Locale/Locale";
import { oauth2Client, config } from "@src/config";
import { withSSRLogger } from "@src/middlewares/withSSRLogger";
import withSession from "@src/middlewares/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const LocalePage: React.FC = () => {
  return (
    <Layout>
      <Locale />
    </Layout>
  );
};

export default LocalePage;

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
