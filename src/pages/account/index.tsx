import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Account: React.FC = () => {
  return (
    <>
      <Head>
        <title>Connect Account</title>
      </Head>
      <AccountBox>
        <AccountCard>
          <Link href="/account/logins">
            <a>Logins</a>
          </Link>
        </AccountCard>
      </AccountBox>
    </>
  );
};

export default Account;

const AccountBox = styled.div`
  width: 100rem;
  padding-top: ${({ theme }) => theme.spaces.component.xxs};
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const AccountCard = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
  border-bottom: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};
`;
