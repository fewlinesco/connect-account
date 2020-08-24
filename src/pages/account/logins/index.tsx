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

import { IdentityTypes, Identity } from "../../../@types/Identity";
import { SortedIdentities } from "../../../@types/SortedIdentities";
import { AddIdentity } from "../../../components/business/AddIdentity";
import { DeleteIdentity } from "../../../components/business/DeleteIdentity";
import { AddIdentityInputForm } from "../../../components/display/fewlines/AddIdentityInputForm";
import { DeleteButton } from "../../../components/display/fewlines/DeleteButton";
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
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Connect Logins</title>
      </Head>
      <IdentitiesBox>
        <IdentitySection>
          <h3>Email(s):</h3>
          {sortedIdentities.emailIdentities.length === 0 ? (
            <Value className="no-email">No emails</Value>
          ) : (
            sortedIdentities.emailIdentities.map((email: Identity) => {
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
                    {sortedIdentities.emailIdentities.length > 1 ? (
                      <DeleteIdentity
                        type={IdentityTypes.EMAIL}
                        value={email.value}
                      >
                        {({ deleteIdentity }) => (
                          <DeleteButton deleteIdentity={deleteIdentity} />
                        )}
                      </DeleteIdentity>
                    ) : null}
                  </Flex>
                </IdentityBox>
              );
            })
          )}
          <Flex>
            <Button
              onClick={() => setAddEmail(!addEmail)}
              color={theme.colors.green}
            >
              Add an email
            </Button>
            {addEmail && (
              <AddIdentity type={IdentityTypes.EMAIL}>
                {({ addIdentity }) => (
                  <AddIdentityInputForm addIdentity={addIdentity} />
                )}
              </AddIdentity>
            )}
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Phone number(s):</h3>
          {sortedIdentities.phoneIdentities.length === 0 ? (
            <Value className="no-phone">No phones</Value>
          ) : (
            sortedIdentities.phoneIdentities.map((phone: Identity) => {
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
                    {sortedIdentities.phoneIdentities.length > 1 ? (
                      <DeleteIdentity
                        type={IdentityTypes.PHONE}
                        value={phone.value}
                      >
                        {({ deleteIdentity }) => (
                          <DeleteButton deleteIdentity={deleteIdentity} />
                        )}
                      </DeleteIdentity>
                    ) : null}
                  </Flex>
                </IdentityBox>
              );
            })
          )}
          <Flex>
            <Button
              onClick={() => setAddPhone(!addPhone)}
              color={theme.colors.green}
            >
              Add a phone number
            </Button>
            {addPhone && (
              <AddIdentity type={IdentityTypes.PHONE}>
                {({ addIdentity }) => (
                  <AddIdentityInputForm addIdentity={addIdentity} />
                )}
              </AddIdentity>
            )}
          </Flex>
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

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

const Value = styled.p`
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
