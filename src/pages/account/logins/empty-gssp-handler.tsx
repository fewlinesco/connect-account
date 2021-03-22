import { Identity } from "@fewlines/connect-management";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import type { SortedIdentities } from "@src/@types/sorted-identities";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import {
  SocialIdentitiesSection,
  StandardIdentitiesSection,
} from "@src/components/pages/logins-overview/logins-overview";
import { LoginsSkeleton } from "@src/components/skeletons/logins-skeleton";
import { Timeline, TimelineEnd } from "@src/components/timelines/timelines";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";

const IDENTITIES_SECTION_CONTENT = {
  EMAIL: {
    title: "Email addresses",
    noIdentityMessage: "No email added yet.",
    addNewIdentityMessage: "Add new email address",
  },
  PHONE: {
    title: "Phone numbers",
    noIdentityMessage: "No phone number added yet.",
    addNewIdentityMessage: "Add new phone number",
  },
  SOCIAL_LOGINS: {
    title: "Social logins",
    noIdentityMessage: "No social logins added yet.",
  },
};

const LoginsOverview: React.FC = () => {
  const { data, error } = useSWR("/api/get-sorted-identities", (url) =>
    fetch(url).then((response) => response.json()),
  );

  if (error) {
    throw new Error(error);
  }

  if (!data) {
    return <LoginsSkeleton />;
  }

  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = data.sortedIdentities;

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <>
      {identitiesSectionList.map(([sectionName, content], index) => {
        const lastOfTheList = index === identitiesSectionList.length - 1;
        let identitiesList: Identity[] = [];

        switch (sectionName) {
          case "EMAIL":
            identitiesList = emailIdentities;
            break;
          case "PHONE":
            identitiesList = phoneIdentities;
            break;
          case "SOCIAL_LOGINS":
            identitiesList = socialIdentities;
            break;
        }

        return (
          <Section key={sectionName} lastOfTheList={lastOfTheList}>
            {lastOfTheList ? <TimelineEnd /> : <Timeline />}
            {sectionName !== "SOCIAL_LOGINS" ? (
              <StandardIdentitiesSection
                sectionName={sectionName}
                content={content}
                identitiesList={identitiesList}
              />
            ) : (
              <SocialIdentitiesSection
                content={content}
                identitiesList={identitiesList}
              />
            )}
          </Section>
        );
      })}
    </>
  );
};

const EmptyGSSPHandlerPage: React.FC = () => {
  return (
    <Layout
      title="Logins"
      breadcrumbs={["Your emails, phones and social logins"]}
    >
      <Container>
        <LoginsOverview />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    sortedIdentities: SortedIdentities;
  }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/logins",
  );
};

const Section = styled.div<{
  lastOfTheList: boolean;
}>`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;
  ${(props) =>
    props.lastOfTheList &&
    `
      padding: 0;
    `}
`;

export { getServerSideProps };
export default EmptyGSSPHandlerPage;
