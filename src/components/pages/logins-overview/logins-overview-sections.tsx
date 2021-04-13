import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import { RightChevron } from "../../icons/right-chevron/right-chevron";
import { Separator } from "../../separator/separator";
import { BoxedLink, IDENTITIES_SECTION_CONTENT } from "./logins-overview";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";
import { getSocialIdentityIcon } from "@src/utils/get-social-identities-icon";

const EmailSection: React.FC<{
  identityList: Identity[];
  hideEmailList: boolean;
}> = ({ identityList, hideEmailList }) => {
  const primaryIdentity = identityList.find((identity) => identity.primary);
  const secondaryIdentities = identityList.filter(
    (identity) => identity.primary === false,
  );

  return !primaryIdentity ? (
    <NoIdentitiesParagraph>
      {IDENTITIES_SECTION_CONTENT.EMAIL.noIdentityMessage}
    </NoIdentitiesParagraph>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/logins/${primaryIdentity.type.toLowerCase()}/${
          primaryIdentity.id
        }`}
      >
        <IdentityValue
          primary={primaryIdentity.primary}
          status={primaryIdentity.status}
        >
          {primaryIdentity.value}
        </IdentityValue>
        <RightChevron />
      </BoxedLink>
      {!hideEmailList && secondaryIdentities.length > 0 ? (
        <>
          {secondaryIdentities.map(({ value, type, id, primary, status }) => {
            return (
              <React.Fragment key={value}>
                <Separator />
                <BoxedLink
                  disableClick={false}
                  href={`/account/logins/${type.toLowerCase()}/${id}`}
                >
                  <IdentityValue primary={primary} status={status}>
                    {value}
                  </IdentityValue>
                  <RightChevron />
                </BoxedLink>
              </React.Fragment>
            );
          })}
        </>
      ) : null}
    </>
  );
};

const PhoneSection: React.FC<{
  identityList: Identity[];
  hideEmailList: boolean;
}> = ({ identityList, hideEmailList }) => {
  const primaryIdentity = identityList.find((identity) => identity.primary);
  const secondaryIdentities = identityList.filter(
    (identity) => identity.primary === false,
  );

  return !primaryIdentity ? (
    <NoIdentitiesParagraph>
      {IDENTITIES_SECTION_CONTENT.PHONE.noIdentityMessage}
    </NoIdentitiesParagraph>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/logins/${primaryIdentity.type.toLowerCase()}/${
          primaryIdentity.id
        }`}
      >
        <IdentityValue
          primary={primaryIdentity.primary}
          status={primaryIdentity.status}
        >
          {primaryIdentity.value}
        </IdentityValue>
        <RightChevron />
      </BoxedLink>
      {!hideEmailList && secondaryIdentities.length > 0 ? (
        <>
          {secondaryIdentities.map(({ value, type, id, primary, status }) => {
            return (
              <React.Fragment key={value}>
                <Separator />
                <BoxedLink
                  disableClick={false}
                  href={`/account/logins/${type.toLowerCase()}/${id}`}
                >
                  <IdentityValue primary={primary} status={status}>
                    {value}
                  </IdentityValue>
                  <RightChevron />
                </BoxedLink>
              </React.Fragment>
            );
          })}
        </>
      ) : null}
    </>
  );
};

const SocialSection: React.FC<{
  identityList: Identity[];
}> = ({ identityList }) => {
  return (
    <>
      {identityList.length === 0 ? (
        <NoIdentitiesParagraph>
          {IDENTITIES_SECTION_CONTENT.SOCIAL.noIdentityMessage}
        </NoIdentitiesParagraph>
      ) : (
        identityList.map(({ type }, index) => (
          <React.Fragment key={type + index}>
            <BoxedLink disableClick={true} href={"#"}>
              <SocialIdentityBox>
                {getSocialIdentityIcon(type)}
                <p>
                  {type === IdentityTypes.KAKAO_TALK ||
                  type === IdentityTypes.VKONTAKTE
                    ? formatSpecialSocialIdentities(type)
                    : capitalizeFirstLetter(type)}
                </p>
              </SocialIdentityBox>
            </BoxedLink>
            {index < identityList.length - 1 && <Separator />}
          </React.Fragment>
        ))
      )}
    </>
  );
};

const IdentityValue = styled.p<Pick<Identity, "primary" | "status">>`
  ${(props) =>
    props.primary &&
    `
      font-weight: ${props.theme.fontWeights.semibold};
    `}

  ${(props) =>
    props.status === "unvalidated" &&
    `
      color: ${props.theme.colors.lightGrey};
    `};
`;

const NoIdentitiesParagraph = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;

  p {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
  }
`;

export { EmailSection, PhoneSection, SocialSection };
