import type { GetServerSideProps } from "next";
import React from "react";

import { getIdentities } from "@lib/queries/getIdentities";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { H2 } from "@src/components/display/fewlines/H2/H2";
import { LoginsOverview } from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";
import { sortIdentities } from "@src/utils/sortIdentities";

type LoginsOverviewPageProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverviewPage: React.FC<LoginsOverviewPageProps> = ({
  sortedIdentities,
}) => {
  return (
    <Container>
      <H1>Logins</H1>
      <H2>Your emails, phones and social logins</H2>
      <LoginsOverview sortedIdentities={sortedIdentities} />
    </Container>
  );
};

export default LoginsOverviewPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ sortedIdentities: SortedIdentities }>(
    context,
    [withLogger, withSentry, withMongoDB, withSession, withAuth],
    async (request: ExtendedRequest) => {
      const user = await getUser(request.headers.cookie as string);

      if (user) {
        const sortedIdentities = await getIdentities(user.sub).then(
          (result) => {
            if (result.errors) {
              throw new GraphqlErrors(result.errors);
            }

            return sortIdentities(result);
          },
        );

        return {
          props: {
            sortedIdentities,
          },
        };
      }

      return { props: {} };
    },
  );
};
