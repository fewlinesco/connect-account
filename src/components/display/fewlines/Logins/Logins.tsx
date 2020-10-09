import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { BoxedLink } from "../BoxedLink/BoxedLink";
import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Identity } from "@lib/@types";
import { SortedIdentities } from "@src/@types/SortedIdentities";

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
    <Container>
      <Head>
        <title>Connect Logins</title>
      </Head>
      <H1>Logins</H1>
      <SubTitle>Your emails, phones and social logins</SubTitle>
      <IdentitySection>
        <h3>Email addresses</h3>
        <ShadowBox>
          {emailIdentities.length === 0 ? (
            <Value>No emails</Value>
          ) : (
            emailList.map((email: Identity) => {
              return (
                <div key={email.value}>
                  <Link
                    href="/account/logins/[type]/[id]"
                    as={`/account/logins/${email.type.toLowerCase()}/${
                      email.id
                    }`}
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
        </ShadowBox>
        {emailIdentities.length > 1 && (
          <Flex>
            <ShowMoreButton
              hide={hideSecondaryEmails}
              quantity={emailIdentities.length - 1}
              setHideSecondary={setHideSecondaryEmails}
            />
          </Flex>
        )}
        <Link href="/account/logins/email/new">
          <Button variant={ButtonVariant.SECONDARY}>
            + Add new email address
          </Button>
        </Link>
      </IdentitySection>
      <IdentitySection>
        <h3>Phone numbers</h3>
        <ShadowBox>
          {phoneIdentities.length === 0 ? (
            <Value>No phones</Value>
          ) : (
            phoneList.map((phone: Identity) => {
              return (
                <div key={phone.value}>
                  <Link
                    href="/account/logins/[type]/[id]"
                    as={`/account/logins/${phone.type.toLowerCase()}/${
                      phone.id
                    }`}
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
        </ShadowBox>
        {phoneIdentities.length > 1 && (
          <Flex>
            <ShowMoreButton
              hide={hideSecondaryPhones}
              quantity={phoneIdentities.length - 1}
              setHideSecondary={setHideSecondaryPhones}
            />
          </Flex>
        )}
        <Link href="/account/logins/phone/new">
          <Button variant={ButtonVariant.SECONDARY}>
            + Add new phone number
          </Button>
        </Link>
      </IdentitySection>
      <IdentitySection>
        <h3>Social logins</h3>
      </IdentitySection>
    </Container>
  );
};

export default Logins;

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const IdentitySection = styled.div`
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;

export const Value = styled.p`
  margin-right: 0.5rem;
`;

export const SubTitle = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;
