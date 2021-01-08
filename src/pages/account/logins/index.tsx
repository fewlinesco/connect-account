import type { GetServerSideProps } from "next";
import React from "react";

import { getIdentities } from "@lib/queries/get-identities";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import { UserCookie } from "@src/@types/UserCookie";
import { NoDataReturned, NoIdentityFound } from "@src/clientErrors";
import { Layout } from "@src/components/Layout";
import { Container } from "@src/components/display/fewlines/Container";
import { LoginsOverview } from "@src/components/display/fewlines/LoginsOverview/LoginsOverview";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";
import { displayAlertBar } from "@src/utils/displayAlertBar";
import { getFlashMessage } from "@src/utils/getFlashMessage";
import { getServerSideCookies } from "@src/utils/serverSideCookies";
import { sortIdentities } from "@src/utils/sortIdentities";

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
