import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import { Identity } from "../../../../../src/@types/Identity";
import { IdentityLine } from "../../../../../src/components/IdentityLine";
import { config, oauth2Client } from "../../../../../src/config";
import { OAuth2Error } from "../../../../../src/errors";
import { withSSRLogger } from "../../../../../src/middleware/withSSRLogger";
import withSession from "../../../../../src/middleware/withSession";
import { getIdentities } from "../../../../../src/queries/getIdentities";
import Sentry from "../../../../../src/utils/sentry";

const ShowIdentity: React.FC<{ identity: Identity }> = ({ identity }) => {
  return <IdentityLine identity={identity} />;
};

export default ShowIdentity;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    try {
      const accessToken = context.req.session.get("user-jwt");

      const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
        accessToken,
        config.connectJwtAlgorithm,
      );

      const identity = await getIdentities(decoded.sub).then((result) => {
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
