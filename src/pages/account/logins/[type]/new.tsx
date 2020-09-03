import { HttpStatus } from "@fewlines/fwl-web";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { GetServerSideProps } from "next";
import React from "react";

import Sentry, { addRequestScopeToSentry } from "../../../..//utils/sentry";
import { IdentityTypes } from "../../../../@types/Identity";
import { AddIdentity } from "../../../../components/business/AddIdentity";
import { AddIdentityInputForm } from "../../../../components/display/fewlines/AddIdentityInputForm";
import { withSSRLogger } from "../../../../middleware/withSSRLogger";
import withSession from "../../../../middleware/withSession";

const AddNewIdentity: React.FC<{ type: IdentityTypes }> = (props) => {
  return (
    <AddIdentity type={props.type}>
      {({ addIdentity }) => (
        <AddIdentityInputForm addIdentity={addIdentity} type={props.type} />
      )}
    </AddIdentity>
  );
};

export default AddNewIdentity;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);
    try {
      return {
        props: {
          type: context.params.type,
        },
      };
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof NotBeforeError ||
        error instanceof TokenExpiredError
      ) {
        Sentry.withScope((scope) => {
          scope.setTag(
            `/pages/account/logins/${context.params.type}/new SSR`,
            `/pages/account/logins/${context.params.type}/new SSR`,
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
