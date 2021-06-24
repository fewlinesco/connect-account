import { HttpStatus } from "@fwl/web";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { Address, Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { ProfileOverview } from "@src/components/pages/profile-overview/profile-overview";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const { data: userProfile, error: userProfileError } = useSWR<
    Profile,
    SWRError
  >(
    `/api/profile/user-profile`,
    async (url) =>
      await fetch(url).then(async (response) => {
        if (!response.ok) {
          if (response.status === HttpStatus.NOT_FOUND) {
            router && router.replace("/account/profile/user-profile/new");
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

  const { data: userAddresses, error: userAddressesError } = useSWR<
    Address[],
    SWRError
  >(`/api/profile/addresses`);

  if (userAddressesError) {
    throw userAddressesError;
  }

  return (
    <Layout
      breadcrumbs="Basic information about you"
      title="Personal information"
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
    "/account/profile",
    () => {
      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default ProfilePage;
