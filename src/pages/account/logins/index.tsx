import { HttpStatus } from "@fwl/web";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import type { Identity } from "@src/@types/Identity";
import type { SortedIdentities } from "@src/@types/SortedIdentities";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { Button, ButtonVariant } from "@src/components/display/fewlines/Button";
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

  let emailList;
  let phoneList;

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
      <h2>Logins</h2>
      <p>Your emails, phones and social logins</p>
      <br />
      <IdentitiesBox>
        <IdentitySection>
          <h3>Email addresses</h3>
          {emailIdentities.length === 0 ? (
            <Value>No emails</Value>
          ) : (
            emailList.map((email: Identity) => {
              return (
                <IdentityBox key={email.value}>
                  <Flex>
                    <Value>
                      <Link
                        href="/account/logins/[type]/[id]"
                        as={`/account/logins/${email.type}/${email.id}`}
                      >
                        <a>{email.value}</a>
                      </Link>
                    </Value>
                  </Flex>
                </IdentityBox>
              );
            })
          )}
          {emailIdentities.length > 1 && (
            <ShowMoreButton
              onClick={() => setHideSecondaryEmails(!hideSecondaryEmails)}
            >
              {hideSecondaryEmails
                ? `Show ${emailIdentities.length - 1} more`
                : `Hide ${emailIdentities.length - 1}`}
            </ShowMoreButton>
          )}
          <Flex>
            <Link href="/account/logins/email/new">
              <Button variant={ButtonVariant.SECONDARY}>
                + Add new email address
              </Button>
            </Link>
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Phone numbers</h3>
          {phoneIdentities.length === 0 ? (
            <Value>No phones</Value>
          ) : (
            phoneList.map((phone: Identity) => {
              return (
                <IdentityBox key={phone.value}>
                  <Flex>
                    <Value>
                      <Link
                        href="/account/logins/[type]/[id]"
                        as={`/account/logins/${phone.type}/${phone.id}`}
                      >
                        <a>{phone.value}</a>
                      </Link>
                    </Value>
                  </Flex>
                </IdentityBox>
              );
            })
          )}
          {phoneIdentities.length > 1 && (
            <ShowMoreButton
              onClick={() => setHideSecondaryPhones(!hideSecondaryPhones)}
            >
              {hideSecondaryPhones
                ? `Show ${phoneIdentities.length - 1} more`
                : `Hide ${phoneIdentities.length - 1}`}
            </ShowMoreButton>
          )}
          <Flex>
            <Link href="/account/logins/phone/new">
              <Button variant={ButtonVariant.SECONDARY}>
                + Add new phone number
              </Button>
            </Link>
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Social logins</h3>
        </IdentitySection>
      </IdentitiesBox>
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
                redirectUrl: context.req.url as string,
              };

              await refreshTokens(body);

              context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
              context.res.setHeader(
                "location",
                `${config.connectDomain}/${body.redirectUrl}`,
              );
              context.res.end();
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

  button {
    width: 100%;
  }
`;
const IdentitiesBox = styled.div`
  padding-top: ${({ theme }) => theme.spaces.component.xxs};
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const IdentitySection = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
  border-bottom: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

export const Value = styled.p`
  margin-right: 0.5rem;
`;

export const ShowMoreButton = styled.button`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.green};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;
