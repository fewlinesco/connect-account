import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";
import { Layout } from "@src/components/page-layout";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitinConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const UpdateUserProfilePage: React.FC = () => {
  const { data: userProfile, error: userProfileError } = useSWR<
    Profile,
    SWRError
  >(`/api/profile/user-profile`);

  if (userProfileError) {
    throw userProfileError;
  }

  return (
    <Layout breadcrumbs={"Profile | edit"} title="Personal information">
      <Container>
        <UserProfileForm userProfileData={userProfile} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitinConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/profile/user-profile/edit",
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
export default UpdateUserProfilePage;
