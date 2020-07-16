import gql from "graphql-tag";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { Trash } from "react-feather";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identity";
import { ProviderUser } from "../@types/ProviderUser";
import { FetchIconButton } from "../components/FetchIconButton";
import { InputForm } from "../components/InputForm";
import { useTheme } from "../design-system/theme/useTheme";
import { fetchManagement } from "../utils/fetchManagement";

interface IndexProps extends JSX.Element {
  fetchedData: { data: { provider: ProviderUser } };
}

const Index: React.FC<IndexProps> = ({ fetchedData }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);

  const theme = useTheme();

  const { user } = fetchedData.data.provider;

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
                  {user.identities.length > 1 ? (
                    <FetchIconButton
                      type={IdentityTypes.EMAIL}
                      method={HttpVerbs.DELETE}
                      value={value}
                      color={theme.colors.red}
                    >
                      <Trash width="15" />
                    </FetchIconButton>
                  ) : (
                    <React.Fragment key={value} />
                  )}
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
            {addEmail && <InputForm type={IdentityTypes.EMAIL} />}
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
            {addPhone && <InputForm type={IdentityTypes.PHONE} />}
          </Flex>
        </IdentitySection>
      </IdentitiesBox>
    </>
  );
};

export default Index;

const USER_QUERY = gql`
  query getUserQuery($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identities {
          type
          value
          primary
          status
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async () => {
  const operation = {
    query: USER_QUERY,
    variables: { userId: "5fab3a52-b242-4377-9e30-ae06589bebe6" },
  };

  const fetchedData = await fetchManagement(operation);

  return {
    props: {
      fetchedData,
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
