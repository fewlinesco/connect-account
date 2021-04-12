import { getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { SetPasswordForm } from "@src/components/forms/set-password-form";
import { Layout } from "@src/components/page-layout";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

const SecurityUpdatePage: React.FC = () => {
  const { data: passwordSetData, error: passwordSetError } = useSWR<
    { isPasswordSet: boolean },
    Error
  >("/api/auth-connect/is-password-set");

  if (passwordSetError) {
    throw passwordSetError;
  }

  let conditionalBreadcrumb;

  if (!passwordSetData) {
    conditionalBreadcrumb = "";
  } else {
    conditionalBreadcrumb = `Password | ${
      passwordSetData.isPasswordSet ? "update" : "set"
    }`;
  }

  return (
    <Layout title="Security" breadcrumbs={conditionalBreadcrumb}>
      <Container>
        <SetPasswordForm
          conditionalBreadcrumbItem={
            !passwordSetData
              ? ""
              : passwordSetData.isPasswordSet
              ? "update"
              : "set"
          }
        />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/security/update",
    async (request) => {
      const webErrors = {
        databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
        noUserFound: ERRORS_DATA.NO_USER_FOUND,
        sudoModeTTLNotFound: ERRORS_DATA.SUDO_MODE_TTL_NOT_FOUND,
      };

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: configVariables.cookieSalt,
      });

      if (!userCookie) {
        throw new NoUserCookieFoundError();
      }

      const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      });

      if (!user) {
        throw webErrorFactory(webErrors.noUserFound);
      }

      const sudoModeTTL = user.sudo.sudo_mode_ttl;

      if (!sudoModeTTL || Date.now() > sudoModeTTL) {
        return {
          redirect: {
            destination: "/account/security/sudo",
            permanent: false,
          },
        };
      }

      return {
        props: {},
      };
    },
  );
};

export { getServerSideProps };
export default SecurityUpdatePage;
