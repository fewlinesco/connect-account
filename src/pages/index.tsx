import {
  ScopesNotSupportedError,
  UnreachableError,
} from "@fewlines/connect-client";
import {
  ConnectUnreachableError,
  getProviderName,
  GraphqlErrors,
} from "@fewlines/connect-management";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import { GetServerSideProps } from "next";
import React from "react";

import { Main } from "@src/components/page-layout";
import { Home } from "@src/components/pages/home/home";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import { oauth2Client } from "@src/configs/oauth2-client";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { noAuthBasicMiddlewares } from "@src/middlewares/basic-middlewares";

type HomePageProps = { authorizeURL: string; providerName: string };

const HomePage: React.FC<HomePageProps> = ({ authorizeURL, providerName }) => {
  return (
    <Main>
      <Home authorizeURL={authorizeURL} providerName={providerName} />
    </Main>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{
    authorizeURL: string;
    providerName: string;
  }>(context, noAuthBasicMiddlewares(getTracer(), logger), "/", async () => {
    const webErrors = {
      identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
      connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
      unreachable: ERRORS_DATA.UNREACHABLE,
      badRequest: ERRORS_DATA.BAD_REQUEST,
    };

    const authorizeURL = await oauth2Client
      .getAuthorizationURL()
      .catch((error) => {
        if (error instanceof ScopesNotSupportedError) {
          throw webErrorFactory(webErrors.badRequest);
        }

        if (error instanceof UnreachableError) {
          throw webErrorFactory({
            ...webErrors.unreachable,
            parentError: error,
          });
        }

        throw error;
      });

    const providerName = await getProviderName(
      configVariables.managementCredentials,
    ).catch((error) => {
      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
          parentError: error,
        });
      }

      if (error instanceof ConnectUnreachableError) {
        throw webErrorFactory({
          ...webErrors.connectUnreachable,
          parentError: error,
        });
      }

      throw error;
    });

    return {
      props: {
        authorizeURL: authorizeURL.toString(),
        providerName,
      },
    };
  });
};

export { getServerSideProps };
export default HomePage;
