import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentities } from "@lib/queries/getIdentities";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import {
  ChildrenContainer,
  DesktopNavigationBarWrapper,
  Flex,
  Main,
  MobileDisplayOnly,
} from "@src/components/Layout";
import { UpdateIdentity } from "@src/components/business/UpdateIdentity";
import { Container } from "@src/components/display/fewlines/Container";
import { DesktopNavigationBar } from "@src/components/display/fewlines/DesktopNavigationBar/DesktopNavigationBar";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { Header } from "@src/components/display/fewlines/Header/Header";
import { MobileNavigationBar } from "@src/components/display/fewlines/MobileNavigationBar/MobileNavigationBar";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { UpdateIdentityForm } from "@src/components/display/fewlines/UpdateIdentityForm/UpdateIdentityForm";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middlewares/withSSRLogger";
import withSession from "@src/middlewares/withSession";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry from "@src/utils/sentry";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  return (
    <Main>
      <MobileDisplayOnly>
        <Header />
        <MobileNavigationBar />
      </MobileDisplayOnly>
      <Flex>
        <DesktopNavigationBarWrapper>
          <DesktopNavigationBar />
        </DesktopNavigationBarWrapper>
        <ChildrenContainer>
          <Container>
            <H1>Logins</H1>
            <NavigationBreadcrumbs
              breadcrumbs={[
                identity.type.toUpperCase() === IdentityTypes.EMAIL
                  ? "Email address"
                  : "Phone number",
                "edit",
              ]}
            />
            <UpdateIdentity identity={identity}>
              {({ updateIdentity }) => (
                <UpdateIdentityForm
                  updateIdentity={updateIdentity}
                  currentIdentity={identity}
                />
              )}
            </UpdateIdentity>
          </Container>
        </ChildrenContainer>
      </Flex>
    </Main>
  );
};

export default UpdateIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    try {
      const userDocumentId = context.req.session.get("user-session-id");

      const user = await getUser(context.req.headers["cookie"]);

      if (user) {
        const decodedJWT = await oauth2Client
          .verifyJWT<AccessToken>(user.accessToken, config.connectJwtAlgorithm)
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const body = {
                userDocumentId,
                refreshToken: user.refreshToken,
              };

              const { access_token } = await refreshTokens(body);

              return access_token;
            } else {
              throw error;
            }
          });

        const identity = await getIdentities(
          (decodedJWT as AccessToken).sub,
        ).then((result) => {
          if (result.errors) {
            throw new GraphqlErrors(result.errors);
          }

          const res = result.data?.provider.user.identities.filter(
            (id) => id.id === context.params.id,
          )[0];

          return res;
        });

        return {
          props: {
            identity,
          },
        };
      } else {
        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }
    } catch (error) {
      if (error instanceof OAuth2Error) {
        Sentry.withScope((scope) => {
          scope.setTag(
            `/pages/account/logins/${context.params.type}/update SSR`,
            `/pages/account/logins/${context.params.type}/update SSR`,
          );
          Sentry.captureException(error);
        });

        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }

      throw error;
    }
  }),
);
