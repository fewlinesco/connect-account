import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { Trash } from "react-feather";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes, Identity } from "../@types/Identity";
import { SortedIdentities } from "../@types/SortedIdentities";
import { FetchIconButton } from "../components/FetchIconButton";
import { IdentityInputForm } from "../components/IdentityInputForm";
import { useTheme } from "../design-system/theme/useTheme";
import { withSSRLogger } from "../middleware/withSSRLogger";
import withSession from "../middleware/withSession";
import { getIdentities } from "../queries/getIdentities";
import { promisifiedJWTVerify } from "../utils/promisifiedJWTVerify";
import { sortIdentities } from "../utils/sortIdentities";

type AccountProps = {
  sortedIdentities: SortedIdentities;
};

const Account: React.FC<AccountProps> = ({ sortedIdentities }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <IdentitiesBox>
        <IdentitySection>
          <h3>Email(s):</h3>
          {sortedIdentities.emailIdentities.length === 0 ? (
            <Value>No emails</Value>
          ) : (
            sortedIdentities.emailIdentities.map((email: Identity) => {
              return (
                <IdentityBox key={email.value}>
                  <Flex>
                    <Value>{email.value}</Value>
                    {sortedIdentities.emailIdentities.length > 1 ? (
                      <FetchIconButton
                        type={IdentityTypes.EMAIL}
                        method={HttpVerbs.DELETE}
                        value={email.value}
                        color={theme.colors.red}
                      >
                        <Trash width="15" />
                      </FetchIconButton>
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
            {addEmail && <IdentityInputForm type={IdentityTypes.EMAIL} />}
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Phone number(s):</h3>
          {sortedIdentities.emailIdentities.length === 0 ? (
            <Value>No phones</Value>
          ) : (
            sortedIdentities.phoneIdentities.map((phone: Identity) => {
              return (
                <IdentityBox key={phone.value}>
                  <Flex>
                    <Value>{phone.value}</Value>
                    {sortedIdentities.phoneIdentities.length > 1 ? (
                      <FetchIconButton
                        type={IdentityTypes.PHONE}
                        method={HttpVerbs.DELETE}
                        value={phone.value}
                        color={theme.colors.red}
                      >
                        <Trash width="15" />
                      </FetchIconButton>
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
            {addPhone && <IdentityInputForm type={IdentityTypes.PHONE} />}
          </Flex>
        </IdentitySection>
      </IdentitiesBox>
    </>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    const accessToken = context.req.session.get("user-jwt");

    const decoded = await promisifiedJWTVerify<{ sub: string }>({
      clientSecret: process.env.API_CLIENT_SECRET,
      accessToken,
    }).catch(() => {
      context.res.statusCode = 302;
      context.res.setHeader("location", "/");
      context.res.end();

      throw new Error("JWT expired");
    });

    if (decoded) {
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
    }

    context.res.statusCode = 302;
    context.res.setHeader("location", "/");
    context.res.end();

    return { props: {} };
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

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
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
