import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../src/@types/HttpVerbs";
import { IdentityTypes, Identity } from "../src/@types/Identities";
import { FetchButton } from "../src/components/FetchButton";
import { FetchIconButton } from "../src/components/FetchIconButton";
import { InputForm } from "../src/components/InputForm";
import { useTheme } from "../src/design-system/theme/useTheme";
import { Trash } from "react-feather";

interface IndexProps extends JSX.Element {
  user: {
    identities: Identity[];
  };
}

const Index: React.FC<IndexProps> = ({ user }) => {
  const [addEmail, setAddEmail] = React.useState<boolean>(false);
  const [addPhone, setAddPhone] = React.useState<boolean>(false);
  const [isHovered, setIsHovered] = React.useState(false);

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
                    value="value"
                    endpoint=""
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
            <div
              onClick={() => setAddEmail(!addEmail)}
              style={{ marginRight: "2rem" }}
            >
              <FetchButton
                // onClick={() => setAddEmail(!addEmail)}
                type={IdentityTypes.EMAIL}
                method={HttpVerbs.DELETE}
                value="value"
                endpoint=""
                color={theme.colors.green}
                label="Add an email"
              />
            </div>
            {addEmail && (
              <InputForm apiUrl="/api/identity" type={IdentityTypes.EMAIL} />
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
                    type={IdentityTypes.EMAIL}
                    method={HttpVerbs.DELETE}
                    value="value"
                    endpoint=""
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
            <div
              onClick={() => setAddPhone(!addPhone)}
              style={{ marginRight: "2rem" }}
            >
              <FetchButton
                // onClick={() => setAddEmail(!addEmail)}
                type={IdentityTypes.EMAIL}
                method={HttpVerbs.DELETE}
                value="value"
                endpoint=""
                color={theme.colors.green}
                label="Add a phone number"
              />
            </div>
            {addPhone && (
              <InputForm apiUrl="/api/identity" type={IdentityTypes.EMAIL} />
            )}
          </Flex>
        </IdentitySection>
      </IdentitiesBox>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const uri = `${process.env.CONNECT_ACCOUNT_BACKEND_URL}/user`;

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

export default Index;
