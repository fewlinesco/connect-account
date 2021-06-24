import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { Container } from "@src/components/containers/container";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const NewUserProfilePage: React.FC = () => {
  const { formatMessage } = useIntl();

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
