import { HttpStatus } from "@fwl/web";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const NewUserProfilePage: React.FC = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { error: userProfileError } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    async (url) =>
      await fetch(url).then(async (response) => {
        if (!response.ok) {
          if (response.status === HttpStatus.NOT_FOUND) {
            router && router.replace("/account/profile/");
            return;
          }

          const error = new SWRError(
            "An error occurred while fetching the data.",
          );
          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      }),
  );

  if (userProfileError) {
    throw userProfileError;
  }

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <Container>
        <InformativeMessage>{formatMessage({ id: "info" })}</InformativeMessage>
        <UserProfileForm isCreation={true} />
      </Container>
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
    "/profile/user-profile/new",
    () => {
      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default NewUserProfilePage;
