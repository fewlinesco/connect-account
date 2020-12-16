import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { SetPassword } from "@src/components/business/SetPassword";
import { Container } from "@src/components/display/fewlines/Container";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { SetPasswordForm } from "@src/components/display/fewlines/SetPasswordForm/SetPasswordForm";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

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
        <SetPassword>
          {({ setPassword }) => (
            <SetPasswordForm
              conditionalBreadcrumbItem={conditionalBreadcrumbItem}
              setPassword={setPassword}
            />
          )}
        </SetPassword>
      </Container>
    </Layout>
  );
};

export default SecurityUpdatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withSession, withAuth],
    async (request: ExtendedRequest) => {
      const userSession = request.session.get<UserCookie>("user-cookie");

      if (userSession) {
        const isPasswordSet = await isUserPasswordSet(userSession.sub).then(
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
