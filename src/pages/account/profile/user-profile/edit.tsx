import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { Container } from "@src/components/containers/container";
import { UserProfileForm } from "@src/components/forms/profile/user-profile-form";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { SWRError } from "@src/errors/errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

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
    basicMiddlewares(getTracer(), logger),
    "/profile/user-profile/edit",
    () => {
      return { props: {} };
    },
  );
};

export { getServerSideProps };
export default UpdateUserProfilePage;
