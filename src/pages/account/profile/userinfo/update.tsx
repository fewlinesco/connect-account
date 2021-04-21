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

import { Address, Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { UpdateUserInfoForm } from "@src/components/forms/update-user-info-form";
import { Layout } from "@src/components/page-layout";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const UpdateUserInfoPage: React.FC = () => {
  const { data, error } = useSWR<
    {
      userInfo: {
        profile: Profile;
        addresses: Address[];
      };
    },
    Error
  >("/api/profile/get-user-info");

  if (error) {
    throw error;
  }

  return (
    <Layout breadcrumbs={"Profile | edit"} title="Personal information">
      <Container>
        <UpdateUserInfoForm profileData={data && data.userInfo.profile} />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
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
    "/profile/name/update",
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
export default UpdateUserInfoPage;
