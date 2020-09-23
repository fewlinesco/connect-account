import { HttpStatus } from "@fwl/web";
import { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { Identity } from "@lib/@types/Identity";
import { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { UpdateIdentity } from "@src/components/business/UpdateIdentity";
import { Box } from "@src/components/display/fewlines/Box/Box";
import { UpdateIdentityForm } from "@src/components/display/fewlines/UpdateIdentityForm";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getIdentities } from "@src/queries/getIdentities";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry from "@src/utils/sentry";

const UpdateIdentityPage: React.FC<{ identity: Identity }> = ({ identity }) => {
  const { value } = identity;

  return (
    <Wrapper>
      <Box key={value}>
        <Flex>
          <Value>{value}</Value>
        </Flex>
      </Box>
      <UpdateIdentity identity={identity}>
        {({ updateIdentity }) => (
          <UpdateIdentityForm
            updateIdentity={updateIdentity}
            currentIdentity={identity}
          />
        )}
      </UpdateIdentity>
    </Wrapper>
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

const Wrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;
`;

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
