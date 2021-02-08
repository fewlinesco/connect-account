import { getIdentities } from "@fewlines/connect-management";
import { getServerSideCookies } from "@fwl/web";
import type { GetServerSideProps } from "next";
import React from "react";

import type { SortedIdentities } from "@src/@types/sorted-identities";
import { UserCookie } from "@src/@types/user-cookie";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { LoginsOverview } from "@src/components/pages/logins-overview/logins-overview";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { displayAlertBar } from "@src/utils/display-alert-bar";
import { getFlashMessage } from "@src/utils/get-flash-message";
import { sortIdentities } from "@src/utils/sort-identities";

type LoginsOverviewPageProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverviewPage: React.FC<LoginsOverviewPageProps> = ({
  sortedIdentities,
}) => {
  const alert = getFlashMessage();

  return (
    <Layout>
      <Container>
        {alert && displayAlertBar(alert)}
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
    [withLogger, withSentry, withAuth],
    async (request) => {
      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const sortedIdentities = await getIdentities(
          config.managementCredentials,
          userCookie.sub,
        ).then((identities) => {
          return sortIdentities(identities);
        });

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
