import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";
import type { GetServerSideProps } from "next";
import React from "react";

import { isUserPasswordSet } from "@lib/queries/isUserPasswordSet";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import { Security } from "@src/components/display/fewlines/Security/Security";
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

const SecurityPage: React.FC<SecurityPageProps> = ({ isPasswordSet }) => {
  return (
    <Container>
      <H1>Security</H1>
      <H2>Password, login history and more</H2>
      <Security isPasswordSet={isPasswordSet} />
    </Container>
  );
};

export default SecurityPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ type: string }>(
    context,
    [withLogger, withSentry, withMongoDB, withSession, withAuth],
    async (request: ExtendedRequest, response: ServerResponse) => {
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
      } else {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return { props: {} };
      }
    },
  );
};
