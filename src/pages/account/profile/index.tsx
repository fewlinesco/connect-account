import { HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { Address, Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { ProfileOverview } from "@src/components/pages/profile-overview/profile-overview";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const { data: userProfile, error: userProfileError } = useSWR<
    Profile,
    SWRError
  >(`/api/profile/user-profile`);

  if (userProfileError) {
    if (userProfileError.statusCode === HttpStatus.NOT_FOUND) {
      router && router.replace("/account/profile/user-profile/new");
    }
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
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/profile",
    () => {
      if (!configVariables.featureFlag) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default ProfilePage;
