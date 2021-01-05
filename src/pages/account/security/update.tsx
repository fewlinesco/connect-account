import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import { UserCookie } from "@src/@types/UserCookie";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { SetPasswordForm } from "@src/components/display/fewlines/SetPasswordForm/SetPasswordForm";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/serverSideCookies";

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
    async (request, response) => {
      const userCookie = await getServerSideCookies<UserCookie>(
        request,
        response,
        "user-cookie",
        true,
      );

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
