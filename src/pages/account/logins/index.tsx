import type { GetServerSideProps } from "next";
import React from "react";

import { getIdentities } from "@lib/queries/get-identities";
import type { SortedIdentities } from "@src/@types/sorted-identities";
import { UserCookie } from "@src/@types/user-cookie";
import { NoDataReturned, NoIdentityFound } from "@src/client-errors";
import { Container } from "@src/components/containers/container";
import { LoginsOverview } from "@src/components/logins-overview/logins-overview";
import { Layout } from "@src/components/page-layout";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { displayAlertBar } from "@src/utils/display-alert-bar";
import { getFlashMessage } from "@src/utils/get-flash-message";
import { getServerSideCookies } from "@src/utils/server-side-cookies";
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
        const sortedIdentities = await getIdentities(userCookie.sub).then(
          ({ errors, data }) => {
            if (errors) {
              throw new GraphqlErrors(errors);
            }

            if (!data) {
              throw new NoDataReturned();
            }

            const identities = data.provider.user.identities;

            if (!identities) {
              throw new NoIdentityFound();
            }

            return sortIdentities(identities);
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
