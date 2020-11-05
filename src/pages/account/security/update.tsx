import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { SetPassword } from "@src/components/business/SetPassword";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { SetPasswordForm } from "@src/components/display/fewlines/SetPasswordForm/SetPasswordForm";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";

type SecurityPageProps = {
  isPasswordSet: boolean;
};

const SecurityUpdatePage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  const conditionalBreadcrumbItem = isPasswordSet ? "update" : "set";

  return (
    <Layout>
      <Container>
        <H1>Security</H1>
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
    [withLogger, withSentry, withMongoDB, withSession, withAuth],
    async (request: ExtendedRequest) => {
      const user = await getUser(request.headers.cookie as string);

      if (user) {
        const isPasswordSet = await isUserPasswordSet(user.sub).then(
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
