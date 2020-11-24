import Cookie from "js-cookie";
import type { GetServerSideProps } from "next";
import React from "react";

import { getIdentities } from "@lib/queries/getIdentities";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { LoginsOverview } from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { displayAlertBar } from "@src/utils/displayAlertBar";
import { sortIdentities } from "@src/utils/sortIdentities";

type LoginsOverviewPageProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverviewPage: React.FC<LoginsOverviewPageProps> = ({
  sortedIdentities,
}) => {
  return (
    <Layout>
      <Container>
        {Cookie.get("message") &&
          displayAlertBar(JSON.stringify(Cookie.get("message")))}
        <h1>Logins</h1>
        <h3>Your emails, phones and social logins</h3>
        <LoginsOverview sortedIdentities={sortedIdentities} />
      </Container>
    </Layout>
  );
};

export default LoginsOverviewPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR<{ sortedIdentities: SortedIdentities }>(
    context,
    [withLogger, withSentry, withSession, withAuth],
    async (request: ExtendedRequest) => {
      const userSession = request.session.get<UserCookie>("user-session");

      if (userSession) {
        const sortedIdentities = await getIdentities(userSession.sub).then(
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
