import Link from "next/link";
import React from "react";
import styled from "styled-components";

import {
  formatSpecialSocialIdentities,
  capitalizeFirstLetter,
} from "../../../../utils/format";
import { Button, ButtonVariant } from "../Button/Button";
import { AppleIcon } from "../Icons/AppleIcon/AppleIcon";
import { FacebookIcon } from "../Icons/FacebookIcon/FacebookIcon";
import { GithubIcon } from "../Icons/GithubIcon/GithubIcon";
import { GoogleIcon } from "../Icons/GoogleIcon/GoogleIcon";
import { KakaoTalkIcon } from "../Icons/KakaoTalkIcon/KakaoTalkIcon";
import { LineIcon } from "../Icons/LineIcon/LineIcon";
import { MicrosoftIcon } from "../Icons/MicrosoftIcon/MicrosoftIcon";
import { NaverIcon } from "../Icons/NaverIcon/NaverIcon";
import { PaypalIcon } from "../Icons/PaypalIcon/PaypalIcon";
import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { StravaIcon } from "../Icons/StravaIcon/StravaIcon";
import { VKontakteIcon } from "../Icons/VKontakteIcon/VKontakteIcon";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import type { Identity } from "@lib/@types";
import { IdentityTypes } from "@lib/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

type BoxedLinkProps = Pick<Identity, "primary" | "status">;

export const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
  const [hideSecondaryEmails, setHideSecondaryEmails] = React.useState<boolean>(
    true,
  );
  const [hideSecondaryPhones, setHideSecondaryPhones] = React.useState<boolean>(
    true,
  );

  const SOCIAL_IDENTITIES_ICONS = {
    APPLE: <AppleIcon />,
    FACEBOOK: <FacebookIcon />,
    GITHUB: <GithubIcon />,
    GOOGLE: <GoogleIcon />,
    KAKAO_TALK: <KakaoTalkIcon />,
    LINE: <LineIcon />,
    NAVER: <NaverIcon />,
    PAYPAL: <PaypalIcon />,
    STRAVA: <StravaIcon />,
    VKONTAKTE: <VKontakteIcon />,
    MICROSOFT: <MicrosoftIcon />,
  };

  const getSocialIdentityIcon = (type: IdentityTypes): JSX.Element => {
    switch (type) {
      case IdentityTypes["APPLE"]:
        return SOCIAL_IDENTITIES_ICONS.APPLE;
      case IdentityTypes["FACEBOOK"]:
        return SOCIAL_IDENTITIES_ICONS.FACEBOOK;
      case IdentityTypes["GITHUB"]:
        return SOCIAL_IDENTITIES_ICONS.GITHUB;
      case IdentityTypes["GOOGLE"]:
        return SOCIAL_IDENTITIES_ICONS.GOOGLE;
      case IdentityTypes["KAKAO_TALK"]:
        return SOCIAL_IDENTITIES_ICONS.KAKAO_TALK;
      case IdentityTypes["LINE"]:
        return SOCIAL_IDENTITIES_ICONS.LINE;
      case IdentityTypes["NAVER"]:
        return SOCIAL_IDENTITIES_ICONS.NAVER;
      case IdentityTypes["PAYPAL"]:
        return SOCIAL_IDENTITIES_ICONS.PAYPAL;
      case IdentityTypes["STRAVA"]:
        return SOCIAL_IDENTITIES_ICONS.STRAVA;
      case IdentityTypes["VKONTAKTE"]:
        return SOCIAL_IDENTITIES_ICONS.VKONTAKTE;
      case IdentityTypes["MICROSOFT"]:
        return SOCIAL_IDENTITIES_ICONS.MICROSOFT;
      default:
        return <React.Fragment />;
    }
  };

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

  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = sortedIdentities;

  return (
    <>
      <IdentitySection>
        <h3>Email addresses</h3>
        <ShadowBox>
          {emailIdentities.length === 0 ? (
            <NoIdentitiesBox>No emails yet.</NoIdentitiesBox>
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
                    <BoxedLink primary={email.primary} status={email.status}>
                      <p>{email.value}</p>
                      <RightChevron />
                    </BoxedLink>
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
          <a>
            <Button variant={ButtonVariant.SECONDARY}>
              + Add new email address
            </Button>
          </a>
        </Link>
      </IdentitySection>
      <IdentitySection>
        <h3>Phone numbers</h3>
        <ShadowBox>
          {phoneIdentities.length === 0 ? (
            <NoIdentitiesBox>No phone number added yet.</NoIdentitiesBox>
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
                    <BoxedLink primary={phone.primary} status={phone.status}>
                      <p>{phone.value}</p>
                      <RightChevron />
                    </BoxedLink>
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
          <a>
            <Button variant={ButtonVariant.SECONDARY}>
              + Add new phone number
            </Button>
          </a>
        </Link>
      </IdentitySection>
      <IdentitySection>
        <h3>Social logins</h3>
        <ShadowBox>
          {socialIdentities.length === 0 ? (
            <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>
          ) : (
            socialIdentities.map((identity: Identity, index) => {
              return (
                <div key={identity.type + index}>
                  <BoxedLink primary={false} status={identity.status}>
                    <SocialIdentityBox>
                      {getSocialIdentityIcon(identity.type)}
                      <SocialIdentityName>
                        {identity.type === IdentityTypes.KAKAO_TALK ||
                        identity.type === IdentityTypes.VKONTAKTE
                          ? formatSpecialSocialIdentities(identity.type)
                          : capitalizeFirstLetter(identity.type)}
                      </SocialIdentityName>
                    </SocialIdentityBox>
                    <RightChevron />
                  </BoxedLink>
                  {socialIdentities.indexOf(identity) <
                    socialIdentities.length - 1 && <Separator />}
                </div>
              );
            })
          )}
        </ShadowBox>
      </IdentitySection>
    </>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const IdentitySection = styled.div`
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;

export const NoIdentitiesBox = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

export const BoxedLink = styled(NeutralLink)<BoxedLinkProps>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

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
