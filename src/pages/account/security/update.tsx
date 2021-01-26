import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/is-user-password-set";
import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { SetPasswordForm } from "@src/components/forms/set-password-form/set-password-form";
import { NavigationBreadcrumbs } from "@src/components/navigation-breadcrumbs/navigation-breadcrumbs";
import { Layout } from "@src/components/page-layout";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

type SecurityPageProps = {
  isPasswordSet: boolean;
};

const SecurityUpdatePage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  const conditionalBreadcrumbItem = isPasswordSet ? "update" : "set";

  return (
    <Layout>
      <Container>
        <h1>Security</h1>
        <NavigationBreadcrumbs
          breadcrumbs={["Password", conditionalBreadcrumbItem]}
        />
        <SetPasswordForm
          conditionalBreadcrumbItem={conditionalBreadcrumbItem}
        />
      </Container>
    </Layout>
  );
};

export default SecurityUpdatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withAuth],
    async (request) => {
      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const isPasswordSet = await isUserPasswordSet(userCookie.sub).then(
          (result) => {
            if (result.errors) {
              throw new GraphqlErrors(result.errors);
            }

            return result;
          },
        );

        return {
          props: {
            isPasswordSet,
          },
        };
      }

      return { props: {} };
    },
  );
};
