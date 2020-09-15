import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import { Identity } from "../../../../../src/@types/Identity";
import { AccessToken } from "../../../../../src/@types/oauth2/OAuth2Tokens";
import { IdentityLine } from "../../../../../src/components/IdentityLine";
import { config, oauth2Client } from "../../../../../src/config";
import { OAuth2Error } from "../../../../../src/errors";
import { withSSRLogger } from "../../../../../src/middleware/withSSRLogger";
import withSession from "../../../../../src/middleware/withSession";
import { getIdentities } from "../../../../../src/queries/getIdentities";
import Sentry from "../../../../../src/utils/sentry";
import { HttpVerbs } from "../../../../@types/HttpVerbs";
import { fetchJson } from "../../../../utils/fetchJson";

const ShowIdentity: React.FC<{ identity: Identity }> = ({ identity }) => {
  return <IdentityLine identity={identity} />;
};

export default ShowIdentity;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    try {
      const userDocumentId = context.req.session.get("user-session-id");

      const route = "/api/auth-connect/get-user";
      const absoluteURL = config.connectDomain + route;

      const { user } = await fetch(absoluteURL).then((response) =>
        response.json(),
      );

      if (user) {
        const decodedJWT = await oauth2Client
          .verifyJWT<AccessToken>(user.accessToken, config.connectJwtAlgorithm)
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const body = {
                userDocumentId,
                refreshToken: user.refreshToken,
                redirectUrl: context.req.url as string,
              };

              const route = "/api/oauth/refresh-token";
              const absoluteURL = config.connectDomain + route;

              await fetchJson(absoluteURL, HttpVerbs.POST, body);

              context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
              context.res.setHeader(
                "location",
                context.req.headers.referer || "/",
              );
              context.res.end();
            } else {
              throw error;
            }
          });

        const identity = await getIdentities(
          (decodedJWT as AccessToken).sub,
        ).then((result) => {
          if (result instanceof Error) {
            throw result;
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
            "/pages/account/logins SSR",
            "/pages/account/logins SSR",
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
