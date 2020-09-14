import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../../../../../@types/HttpVerbs";
import { Identity } from "../../../../../@types/Identity";
import { AccessToken } from "../../../../../@types/oauth2/OAuth2Tokens";
import { UpdateIdentity } from "../../../../../components/business/UpdateIdentity";
import { UpdateIdentityForm } from "../../../../../components/display/fewlines/UpdateIdentityForm";
import { config, oauth2Client } from "../../../../../config";
import { OAuth2Error } from "../../../../../errors";
import { withSSRLogger } from "../../../../../middleware/withSSRLogger";
import withSession from "../../../../../middleware/withSession";
import { getIdentities } from "../../../../../queries/getIdentities";
import { fetchJson } from "../../../../../utils/fetchJson";
import Sentry from "../../../../../utils/sentry";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  const { value } = identity;

  return (
    <>
      <IdentityBox key={value}>
        <Flex>
          <Value>{value}</Value>
        </Flex>
      </IdentityBox>
      <UpdateIdentity identity={identity}>
        {({ updateIdentity }) => (
          <UpdateIdentityForm
            updateIdentity={updateIdentity}
            currentIdentity={identity}
          />
        )}
      </UpdateIdentity>
    </>
  );
};

export default UpdateIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    try {
      const userDocumentId = context.req.session.get("user-document-id");

      const route = "/api/auth-connect/get-mongo-user";
      const absoluteURL = config.connectDomain + route;

      const { user } = await fetchJson(absoluteURL, HttpVerbs.POST, {
        userDocumentId,
      }).then((response) => response.json());

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
