import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";

import type { ReceivedIdentityTypes } from "../../../../@types/Identity";
import { AddIdentity } from "../../../../components/business/AddIdentity";
import { AddIdentityInputForm } from "../../../../components/display/fewlines/AddIdentityInputForm";
import { OAuth2Error } from "../../../../errors";
import { withSSRLogger } from "../../../../middleware/withSSRLogger";
import withSession from "../../../../middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "../../../../utils/sentry";

const AddNewIdentity: React.FC<{ type: ReceivedIdentityTypes }> = (props) => {
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
      if (error instanceof OAuth2Error) {
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
