import { HttpStatus } from "@fewlines/fwl-web";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Identity } from "../../../@types/Identity";
import { SortedIdentities } from "../../../@types/SortedIdentities";
import { config } from "../../../config";
import { useTheme } from "../../../design-system/theme/useTheme";
import { withSSRLogger } from "../../../middleware/withSSRLogger";
import withSession from "../../../middleware/withSession";
import { getIdentities } from "../../../queries/getIdentities";
import { promisifiedJWTVerify } from "../../../utils/promisifiedJWTVerify";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";
import { sortIdentities } from "../../../utils/sortIdentities";

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
    ? (emailList = sortedIdentities.emailIdentities.filter((id) => id.primary))
    : (emailList = sortedIdentities.emailIdentities);

  hideSecondaryPhones
    ? (phoneList = sortedIdentities.phoneIdentities.filter((id) => id.primary))
    : (phoneList = sortedIdentities.phoneIdentities);

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Connect Logins</title>
      </Head>
      <h2>Logins</h2>
      <p>Your emails, phones and social logins</p>
      <br />
      <IdentitiesBox>
        <IdentitySection>
          <h3>Email addresses</h3>
          {sortedIdentities.emailIdentities.length === 0 ? (
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
          {sortedIdentities.emailIdentities.length > 1 && (
            <ShowMoreButton
              onClick={() => setHideSecondaryEmails(!hideSecondaryEmails)}
              color={theme.colors.green}
            >
              {hideSecondaryEmails
                ? `Show ${sortedIdentities.emailIdentities.length - 1} more`
                : `Hide ${sortedIdentities.emailIdentities.length - 1}`}
            </ShowMoreButton>
          )}
          <Flex>
            <Link href="/account/logins/email/new">
              <Button color={theme.colors.green}>
                + Add new email address
              </Button>
            </Link>
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Phone numbers:</h3>
          {sortedIdentities.phoneIdentities.length === 0 ? (
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
          {sortedIdentities.phoneIdentities.length > 1 && (
            <ShowMoreButton
              onClick={() => setHideSecondaryPhones(!hideSecondaryPhones)}
              color={theme.colors.green}
            >
              {hideSecondaryPhones
                ? `Show ${sortedIdentities.phoneIdentities.length - 1} more`
                : `Hide ${sortedIdentities.phoneIdentities.length - 1}`}
            </ShowMoreButton>
          )}
          <Flex>
            <Link href="/account/logins/phone/new">
              <Button color={theme.colors.green}>+ Add new phone number</Button>
            </Link>
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Social logins</h3>
        </IdentitySection>
      </IdentitiesBox>
    </>
  );
};

export default Logins;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);

    try {
      const accessToken = context.req.session.get("user-jwt");

      const decoded = await promisifiedJWTVerify<{ sub: string }>(
        config.connectApplicationClientSecret,
        accessToken,
      );

      const sortedIdentities = await getIdentities(decoded.sub).then(
        (result) => {
          if (result instanceof Error) {
            throw result;
          }

          return sortIdentities(result);
        },
      );

      return {
        props: {
          sortedIdentities,
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

const IdentitiesBox = styled.div`
  width: 100rem;
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

type ButtonProps = {
  color: string;
};

const Button = styled.button<ButtonProps>`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  ${(props) => `color: ${props.color}`};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;

export const ShowMoreButton = styled.button<ButtonProps>`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  ${(props) => `color: ${props.color}`};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;
