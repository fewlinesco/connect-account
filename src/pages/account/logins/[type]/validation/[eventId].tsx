import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import type { IdentityTypes } from "@lib/@types/Identity";
import { VerifyIdentity } from "@src/components/business/VerifyIdentity";
import IdentityValidationForm from "@src/components/display/fewlines/IdentityValidationForm";
import { OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const IdentityValidationPage: React.FC<{
  type: IdentityTypes;
  eventId: string;
}> = ({ type, eventId }) => {
  return (
    <VerifyIdentity eventId={eventId}>
      {({ verifyIdentity }) => (
        <IdentityValidationForm type={type} verifyIdentity={verifyIdentity} />
      )}
    </VerifyIdentity>
  );
};

export default IdentityValidationPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      return {
        props: {
          type: context.params.type,
          eventId: context.params.eventId,
        },
      };
    } catch (error) {
      if (error instanceof OAuth2Error) {
        Sentry.withScope((scope) => {
          scope.setTag(
            `/pages/account/logins/${context.params.type}/validation SSR`,
            `/pages/account/logins/${context.params.type}/validation SSR`,
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
