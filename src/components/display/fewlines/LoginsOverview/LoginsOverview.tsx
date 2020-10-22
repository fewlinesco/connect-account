import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { BoxedLink } from "../BoxedLink/BoxedLink";
import { Button, ButtonVariant } from "../Button/Button";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import type { Identity } from "@lib/@types";
import { SortedIdentities } from "@src/@types/SortedIdentities";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
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
    <>
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
    </>
  );
};

export default LoginsOverview;

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
