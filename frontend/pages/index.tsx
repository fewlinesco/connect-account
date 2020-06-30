import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../src/@types/HttpVerbs";
import { IdentityTypes, Identity } from "../src/@types/Identities";
import { FetchIconButton } from "../src/components/FetchIconButton";
import { InputForm } from "../src/components/InputForm";
import { useTheme } from "../src/design-system/theme/useTheme";
import { Trash } from "react-feather";

interface IndexProps extends JSX.Element {
  user: {
    identities: Identity[];
  };
  identitiesEndpoint: string;
}

const Index: React.FC<IndexProps> = ({ user, identitiesEndpoint }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Connect Account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <IdentitiesBox>
        <IdentitySection>
          <h3>Email(s):</h3>
          {user.identities.map(({ value, type }) => {
            return type === IdentityTypes.EMAIL.toLowerCase() ? (
              <IdentityBox key={value}>
                <Flex>
                  <Value>{value}</Value>
                  <FetchIconButton
                    type={IdentityTypes.EMAIL}
                    method={HttpVerbs.DELETE}
                    value={value}
                    endpoint={identitiesEndpoint}
                    color={theme.colors.red}
                  >
                    <Trash width="15" />
                  </FetchIconButton>
                </Flex>
              </IdentityBox>
            ) : (
              <React.Fragment key={value} />
            );
          })}
          <Flex>
            <Button
              onClick={() => setAddEmail(!addEmail)}
              color={theme.colors.green}
            >
              Add an email
            </Button>
            {addEmail && (
              <InputForm
                apiUrl={identitiesEndpoint}
                type={IdentityTypes.EMAIL}
              />
            )}
          </Flex>
        </IdentitySection>
        <IdentitySection>
          <h3>Phone number(s):</h3>
          {user.identities.map(({ value, type }) => {
            return type === IdentityTypes.PHONE.toLowerCase() ? (
              <IdentityBox key={value}>
                <Flex>
                  <Value>{value}</Value>
                  <FetchIconButton
                    type={IdentityTypes.PHONE}
                    method={HttpVerbs.DELETE}
                    value={value}
                    endpoint={identitiesEndpoint}
                    color={theme.colors.red}
                  >
                    <Trash width="15" />
                  </FetchIconButton>
                </Flex>
              </IdentityBox>
            ) : (
              <React.Fragment key={value} />
            );
          })}
          <Flex>
            <Button
              onClick={() => setAddPhone(!addEmail)}
              color={theme.colors.green}
            >
              Add a phone number
            </Button>

            {addPhone && (
              <InputForm
                apiUrl={identitiesEndpoint}
                type={IdentityTypes.PHONE}
              />
            )}
          </Flex>
        </IdentitySection>
      </IdentitiesBox>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const uri = `${process.env.CONNECT_ACCOUNT_BACKEND_URL}/user`;
  const identitiesEndpoint = `${process.env.CONNECT_ACCOUNT_BACKEND_URL}/user/identities`;

  const fetchedData = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: "5b5fe222-3070-4169-8f24-51b587b2dbc5" }),
  }).then((response) => response.json());

  const { user } = fetchedData.data.provider;

  return {
    props: {
      user,
      identitiesEndpoint,
    },
  };
};

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

export default Index;
