import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import { UserCookie } from "@src/@types/UserCookie";
import { NoDataReturned } from "@src/clientErrors";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { Security } from "@src/components/display/fewlines/Security/Security";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/serverSideCookies";

type SecurityPageProps = {
  isPasswordSet: boolean;
};

const SecurityPage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  return (
    <Layout>
      <Container>
        <h1>Security</h1>
        <h3>Password, login history and more</h3>
        <Security isPasswordSet={isPasswordSet} />
      </Container>
    </Layout>
  );
};

export default SecurityPage;

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
          ({ errors, data }) => {
            if (errors) {
              throw new GraphqlErrors(errors);
            }

            if (!data) {
              throw new NoDataReturned();
            }

            return data.provider.user.passwords.available;
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
