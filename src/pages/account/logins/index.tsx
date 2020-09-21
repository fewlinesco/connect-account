import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import type { Identity } from "@src/@types/Identity";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { BoxedLink } from "@src/components/display/fewlines/BoxedLink/BoxedLink";
import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { IdentityContainer } from "@src/components/display/fewlines/IdentityContainer/IdentityContainer";
import { NeutralLink } from "@src/components/display/fewlines/NeutralLink/NeutralLink";
import { Separator } from "@src/components/display/fewlines/Separator/Separator";
import { ShowMoreButton } from "@src/components/display/fewlines/ShowMoreButton/ShowMoreButton";
import { config, oauth2Client } from "@src/config";
import { OAuth2Error } from "@src/errors";
import { withSSRLogger } from "@src/middleware/withSSRLogger";
import withSession from "@src/middleware/withSession";
import { getIdentities } from "@src/queries/getIdentities";
import { getUser } from "@src/utils/getUser";
import { refreshTokens } from "@src/utils/refreshTokens";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";
import { sortIdentities } from "@src/utils/sortIdentities";

type LoginsProps = {
  sortedIdentities: SortedIdentities;
};

const Logins: React.FC<LoginsProps> = ({ sortedIdentities }) => {
  const [hideSecondaryEmails, setHideSecondaryEmails] = React.useState<boolean>(
    true,
  );
  const [hideSecondaryPhones, setHideSecondaryPhones] = React.useState<boolean>(
    true,
  );

  let emailList: Identity[];
  let phoneList: Identity[];

  hideSecondaryEmails
    ? (emailList = sortedIdentities.emailIdentities.filter(
        (identity) => identity.primary,
      ))
    : (emailList = sortedIdentities.emailIdentities);

  hideSecondaryPhones
    ? (phoneList = sortedIdentities.phoneIdentities.filter(
        (identity) => identity.primary,
      ))
    : (phoneList = sortedIdentities.phoneIdentities);

  const { emailIdentities, phoneIdentities } = sortedIdentities;

  return (
    <Wrapper>
      <Head>
        <title>Connect Logins</title>
      </Head>
      <IdentitySection>
        <h2>Logins</h2>
        <p className="section-description">
          Your emails, phones and social logins
        </p>
        <h3>Email addresses</h3>
        <IdentityContainer className="identity-container">
          {emailIdentities.length === 0 ? (
            <Value>No emails</Value>
          ) : (
            emailList.map((email: Identity) => {
              return (
                <div key={email.value}>
                  <Link
                    href="/account/logins/[type]/[id]"
                    as={`/account/logins/${email.type}/${email.id}`}
                  >
                    <NeutralLink>
                      <BoxedLink
                        value={email.value}
                        primary={email.primary}
                        status={email.status}
                      />
                    </NeutralLink>
                  </Link>
                  {emailList.indexOf(email) < emailList.length - 1 && (
                    <Separator />
                  )}
                </div>
              );
            })
          )}
        </IdentityContainer>
        {emailIdentities.length > 1 && (
          <ShowMoreButton
            hide={hideSecondaryEmails}
            quantity={emailIdentities.length - 1}
            setHideSecondary={setHideSecondaryEmails}
          />
        )}
        <Flex>
          <Link href="/account/logins/email/new">
            <Button variant={ButtonVariant.SECONDARY}>
              + Add new email address
            </Button>
          </Link>
        </Flex>
        <h3>Phone numbers</h3>
        <IdentityContainer className="identity-container">
          {phoneIdentities.length === 0 ? (
            <Value>No phones</Value>
          ) : (
            phoneList.map((phone: Identity) => {
              return (
                <div key={phone.value}>
                  <Link
                    href="/account/logins/[type]/[id]"
                    as={`/account/logins/${phone.type}/${phone.id}`}
                  >
                    <NeutralLink>
                      <BoxedLink
                        value={phone.value}
                        primary={phone.primary}
                        status={phone.status}
                      />
                    </NeutralLink>
                  </Link>
                  {phoneList.indexOf(phone) < phoneList.length - 1 && (
                    <Separator />
                  )}
                </div>
              );
            })
          )}
        </IdentityContainer>
        {phoneIdentities.length > 1 && (
          <ShowMoreButton
            hide={hideSecondaryPhones}
            quantity={phoneIdentities.length - 1}
            setHideSecondary={setHideSecondaryPhones}
          />
        )}
        <Flex>
          <Link href="/account/logins/phone/new">
            <Button variant={ButtonVariant.SECONDARY}>
              + Add new phone number
            </Button>
          </Link>
        </Flex>
        <h3>Social logins</h3>
      </IdentitySection>
    </Wrapper>
  );
};

export default Logins;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

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

        const sortedIdentities = await getIdentities(
          (decodedJWT as AccessToken).sub,
        ).then((result) => {
          if (result instanceof Error) {
            throw result;
          }

          return sortIdentities(result);
        });

        return {
          props: {
            sortedIdentities,
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

const Wrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;

  .identity-container {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  button {
    width: 100%;
    margin: 0 0 ${({ theme }) => theme.spaces.component.s} 0;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const IdentitySection = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
  border-bottom: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};

  .section-description {
    margin: 0 0 ${({ theme }) => theme.spaces.component.s} 0;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const Value = styled.p`
  margin-right: 0.5rem;
`;
