import { HttpStatus } from "@fewlines/fwl-web";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { Identity } from "../../../../../@types/Identity";
import { UpdateInput } from "../../../../../components/UpdateInput";
import { UpdateCurrentIdentity } from "../../../../../components/business/UpdateIdentity";
import { config } from "../../../../../config";
import { withSSRLogger } from "../../../../../middleware/withSSRLogger";
import withSession from "../../../../../middleware/withSession";
import { getIdentities } from "../../../../../queries/getIdentities";
import { promisifiedJWTVerify } from "../../../../../utils/promisifiedJWTVerify";
import Sentry from "../../../../../utils/sentry";

const UpdateIdentity: React.FC<{ identity: Identity }> = ({ identity }) => {
  const { value } = identity;
  return (
    <>
      <IdentityBox key={value}>
        <Flex>
          <Value>{value}</Value>
        </Flex>
      </IdentityBox>
      <UpdateCurrentIdentity identity={identity}>
        {({ updateIdentity }) => (
          <UpdateInput
            updateIdentity={updateIdentity}
            currentIdentity={identity}
          />
        )}
      </UpdateCurrentIdentity>
    </>
  );
};

export default UpdateIdentity;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    try {
      const accessToken = context.req.session.get("user-jwt");

      const decoded = await promisifiedJWTVerify<{ sub: string }>(
        config.connectApplicationClientSecret,
        accessToken,
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
      if (
        error instanceof JsonWebTokenError ||
        error instanceof NotBeforeError ||
        error instanceof TokenExpiredError
      ) {
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

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

const Value = styled.p`
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
