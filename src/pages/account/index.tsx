import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { AccountOverview } from "@src/components/display/fewlines/AccountOverview/AccountOverview";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { oauth2Client, config } from "@src/config";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";
import { withSSRLogger } from "@src/middlewares/withSSRLogger";
import withSession from "@src/middlewares/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const AccountPage: React.FC = () => {
  return (
    <Container>
      <WelcomeMessage>Welcome to your account</WelcomeMessage>
      <AccountOverview />
    </Container>
  );
};

export default AccountPage;

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

export const WelcomeMessage = styled(H1)`
  margin-top: 0.5rem;
  margin-bottom: 5rem;

  @media ${deviceBreakpoints.m} {
    margin-bottom: 4rem;
  }
`;
