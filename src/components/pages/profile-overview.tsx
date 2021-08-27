import Image from "next/image";
import React from "react";
import { useIntl } from "react-intl";

import { Address, Profile } from "@src/@types/profile";
import { SectionBox } from "@src/components/boxes";
import { ShowMoreButton } from "@src/components/buttons";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture";
import { RightChevron } from "@src/components/icons/right-chevron";
import { NeutralLink } from "@src/components/neutral-link";
import { Separator } from "@src/components/separator";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import {
  capitalizeFirstLetter,
  formatOtherAddressFieldsToDisplay,
  formatStreetAddressToDisplay,
} from "@src/utils/format";

const ProfileOverview: React.FC<{
  userProfile?: Profile;
  userAddresses?: Address[];
}> = ({ userProfile, userAddresses }) => {
  const [hideAddressList, setHideAddressList] = React.useState<boolean>(true);
  const { formatMessage } = useIntl();

  return (
    <>
      <h3>{formatMessage({ id: "profileSection" })}</h3>
      <SectionBox>
        <NeutralLink className="link-boxed" href="#">
          <div className="flex items-center justify-center">
            {!userProfile || !userProfile.picture ? (
              <div className="mr-6">
                <DefaultProfilePictureIcon />
              </div>
            ) : (
              <Image
                src={userProfile.picture}
                className="w-28 h-28 rounded-full mr-6"
                alt="User"
              />
            )}
            <p className="text-gray-darker text-m font-medium tracking-widest">
              {formatMessage({ id: "profilePicture" })}
            </p>
          </div>
        </NeutralLink>
        <Separator />
        <UserInfoSection categoryName={formatMessage({ id: "name" })} href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.name
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "preferredName" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.preferred_username
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "birthDate" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.birthdate
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "timeZone" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.zoneinfo
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "locale" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.locale
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "website" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.website
          )}
        </UserInfoSection>
        <UserInfoSection
          categoryName={formatMessage({ id: "profile" })}
          href="#"
        >
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.profile
          )}
        </UserInfoSection>
      </SectionBox>
      <NeutralLink href={"/account/profile/user-profile/edit/"}>
        <div className="btn btn-primary btn-neutral-link">
          {formatMessage({ id: "updateInfo" })}
        </div>
      </NeutralLink>
      <h3>{formatMessage({ id: "addressesSection" })}</h3>
      <SectionBox>
        {!userAddresses ? (
          <NeutralLink className="link-boxed-disabled" href="#">
            <SkeletonTextLine fontSize={1.6} width={50} />
          </NeutralLink>
        ) : (
          <UserAddresses
            hideAddressList={hideAddressList}
            addressList={userAddresses}
          />
        )}
      </SectionBox>
      {userAddresses && userAddresses.length > 1 ? (
        <div className="flex items-center justify-center">
          <ShowMoreButton
            hideList={hideAddressList}
            quantity={userAddresses.length - 1}
            onPress={() => setHideAddressList(!hideAddressList)}
          />
        </div>
      ) : null}
      {userAddresses ? (
        <NeutralLink href="/account/profile/addresses/new/">
          <div className="btn btn-secondary btn-neutral-link">
            + {formatMessage({ id: "addAddress" })}
          </div>
        </NeutralLink>
      ) : null}
    </>
  );
};

const UserInfoSection: React.FC<{
  categoryName: string;
  href: string;
}> = ({ categoryName, href, children }) => {
  return (
    <>
      <NeutralLink className="link-boxed h-28" href={href}>
        <div className="w-full flex flex-col">
          <p className="text-gray-darker text-m font-medium tracking-widest mb-3">
            {categoryName}
          </p>
          {children}
        </div>
      </NeutralLink>
      <Separator />
    </>
  );
};

const UserAddresses: React.FC<{
  hideAddressList: boolean;
  addressList: Address[];
}> = ({ hideAddressList, addressList }) => {
  const { formatMessage } = useIntl();
  const primaryAddress = addressList.find((address) => address.primary);
  const secondaryAddresses = addressList.filter(
    (address) => address.primary === false,
  );

  return !primaryAddress ? (
    <p className="flex items-center h-28 mr-2 px-8">
      {formatMessage({ id: "noAddresses" })}
    </p>
  ) : (
    <>
      <NeutralLink
        className="link-boxed"
        href={`/account/profile/addresses/${primaryAddress.id}/`}
      >
        <div className="w-full flex flex-col">
          {primaryAddress.kind && (
            <p className="text-gray-darker text-m font-medium tracking-widest mb-3">
              {capitalizeFirstLetter(primaryAddress.kind)}
            </p>
          )}
          <p
            className={`truncate w-11/12 leading-10  ${
              primaryAddress.primary ? "font-semibold" : ""
            }`}
          >
            {formatStreetAddressToDisplay(primaryAddress)}
          </p>
          <p
            className={`truncate w-11/12 leading-10  ${
              primaryAddress.primary ? "font-semibold" : ""
            }`}
          >
            {formatOtherAddressFieldsToDisplay(primaryAddress)}
          </p>
        </div>
        <RightChevron />
      </NeutralLink>
      {!hideAddressList && addressList.length > 0 ? (
        <>
          {secondaryAddresses.map((address) => {
            return (
              <React.Fragment key={address.id + address.sub}>
                <Separator />
                <NeutralLink
                  className="link-boxed"
                  href={`/account/profile/addresses/${address.id}/`}
                >
                  <div className="w-full flex flex-col">
                    <p className="text-gray-darker text-m font-medium tracking-widest mb-3">
                      {capitalizeFirstLetter(address.kind)}
                    </p>
                    <p
                      className={`truncate w-11/12 leading-10  ${
                        address.primary ? "font-semibold" : ""
                      }`}
                    >
                      {formatStreetAddressToDisplay(address)}
                    </p>
                    <p
                      className={`truncate w-11/12 leading-10 ${
                        address.primary ? "font-semibold" : ""
                      }`}
                    >
                      {formatOtherAddressFieldsToDisplay(address)}
                    </p>
                  </div>
                  <RightChevron />
                </NeutralLink>
              </React.Fragment>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export { ProfileOverview };
