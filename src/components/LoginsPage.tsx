import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { BoxedLink } from "./display/fewlines/BoxedLink/BoxedLink";
import { Button, ButtonVariant } from "./display/fewlines/Button/Button";
import { IdentityContainer } from "./display/fewlines/IdentityContainer/IdentityContainer";
import { NeutralLink } from "./display/fewlines/NeutralLink/NeutralLink";
import { Separator } from "./display/fewlines/Separator/Separator";
import { ShowMoreButton } from "./display/fewlines/ShowMoreButton/ShowMoreButton";
import { Identity } from "@src/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";

type LoginsProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsPage: React.FC<LoginsProps> = ({ sortedIdentities }) => {
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
        <NavigationBreadcrumbs
          title="Logins"
          breadcrumbs="Your emails, phones and social logins"
        />
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

export default LoginsPage;

const Wrapper = styled.div`
  max-width: 90%;
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
