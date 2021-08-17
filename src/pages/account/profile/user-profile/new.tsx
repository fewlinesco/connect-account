import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { newProfileSWRFetcher } from "@src/queries/new-profile-swr-fetcher";

const NewUserProfilePage: React.FC = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { error: userProfileError } = useSWR<Profile | undefined, SWRError>(
    [`/api/profile/user-profile/`, router],
    newProfileSWRFetcher,
  );

  if (userProfileError) {
    throw userProfileError;
  }

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <InformativeMessage>{formatMessage({ id: "info" })}</InformativeMessage>
      <UserProfileForm isCreation={true} />
    </Layout>
  );
};

const InformativeMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.paragraph};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: 2rem;
`;

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "/profile/user-profile/new/",
    () => {
      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default NewUserProfilePage;
