import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { Address, Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { ProfileOverview } from "@src/components/pages/profile-overview/profile-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { profileOverviewSWRFetcher } from "@src/queries/profile-overview-swr-fetcher";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { data: userProfile, error: userProfileError } = useSWR<
    Profile,
    SWRError
  >([`/api/profile/user-profile/`, router], profileOverviewSWRFetcher);

  if (userProfileError) {
    throw userProfileError;
  }

  const { data: userAddresses, error: userAddressesError } = useSWR<
    Address[],
    SWRError
  >(`/api/profile/addresses/`, profileOverviewSWRFetcher);

  if (userAddressesError) {
    throw userAddressesError;
  }

  return (
    <Layout
      breadcrumbs={formatMessage({ id: "breadcrumb" })}
      title={formatMessage({ id: "title" })}
    >
      <Container>
        <ProfileOverview
          userProfile={userProfile}
          userAddresses={userAddresses}
        />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    basicMiddlewares(getTracer(), logger),
    "/account/profile/",
  );
};

export { getServerSideProps };
export default ProfilePage;
