import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import { useIntl } from "react-intl";

import { RightChevron } from "../../icons/right-chevron";
import { Separator } from "../../separator";
import { BoxedLink } from "@src/components/boxed-link";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";
import { getSocialIdentityIcon } from "@src/utils/get-social-identities-icon";

const EmailSection: React.FC<{
  identityList: Identity[];
  hideEmailList: boolean;
}> = ({ identityList, hideEmailList }) => {
  const { formatMessage } = useIntl();

  const primaryIdentity = identityList.find((identity) => identity.primary);
  const secondaryIdentities = identityList.filter(
    (identity) => identity.primary === false,
  );

  return !primaryIdentity ? (
    <p className="flex items-center h-28 mr-2 px-8">
      {formatMessage({ id: "emailNoIdentityMessage" })}
    </p>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/logins/${primaryIdentity.type.toLowerCase()}/${
          primaryIdentity.id
        }/`}
      >
        <p
          className={`truncate w-11/12 leading-10 ${
            primaryIdentity.primary ? "font-semibold" : ""
          } ${
            primaryIdentity.status === "unvalidated" ? "text-gray-dark" : ""
          }`}
        >
          {primaryIdentity.value}
        </p>
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
                  href={`/account/logins/${type.toLowerCase()}/${id}/`}
                >
                  <p
                    className={`truncate w-11/12 leading-10 ${
                      primary ? "font-semibold" : ""
                    } ${status === "unvalidated" ? "text-gray-dark" : ""}`}
                  >
                    {value}
                  </p>
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
  const { formatMessage } = useIntl();

  const primaryIdentity = identityList.find((identity) => identity.primary);
  const secondaryIdentities = identityList.filter(
    (identity) => identity.primary === false,
  );

  return !primaryIdentity ? (
    <p className="flex items-center h-28 mr-2 px-8">
      {formatMessage({ id: "phoneNoIdentityMessage" })}
    </p>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/logins/${primaryIdentity.type.toLowerCase()}/${
          primaryIdentity.id
        }/`}
      >
        <p
          className={`truncate w-11/12 leading-10 ${
            primaryIdentity.primary ? "font-semibold" : ""
          } ${
            primaryIdentity.status === "unvalidated" ? "text-gray-dark" : ""
          }`}
        >
          {primaryIdentity.value}
        </p>
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
                  href={`/account/logins/${type.toLowerCase()}/${id}/`}
                >
                  <p
                    className={`truncate w-11/12 leading-10 ${
                      primary ? "font-semibold" : ""
                    } ${status === "unvalidated" ? "text-gray-dark" : ""}`}
                  >
                    {value}
                  </p>
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
  const { formatMessage } = useIntl();

  return (
    <>
      {identityList.length === 0 ? (
        <p className="flex items-center h-28 mr-2 px-8">
          {formatMessage({ id: "socialNoIdentityMessage" })}
        </p>
      ) : (
        identityList.map(({ type }, index) => (
          <React.Fragment key={type + index}>
            <BoxedLink disableClick={true} href="#">
              <div className="flex items-center">
                {getSocialIdentityIcon(type)}
                <p className="ml-4">
                  {type === IdentityTypes.KAKAO_TALK ||
                  type === IdentityTypes.VKONTAKTE
                    ? formatSpecialSocialIdentities(type)
                    : capitalizeFirstLetter(type)}
                </p>
              </div>
            </BoxedLink>
            {index < identityList.length - 1 && <Separator />}
          </React.Fragment>
        ))
      )}
    </>
  );
};

export { EmailSection, PhoneSection, SocialSection };
