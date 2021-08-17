import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { Address, Profile } from "@src/@types/profile";
import { BoxedLink } from "@src/components/boxed-link";
import { ButtonVariant, ShowMoreButton } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture/default-profile-picture";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { NeutralLink } from "@src/components/neutral-link";
import { SectionBox } from "@src/components/section-box";
import { Separator } from "@src/components/separator";
import { SkeletonTextLine } from "@src/components/skeletons";
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
        <BoxedLink disableClick={false} href="#">
          <Flex>
            {!userProfile || !userProfile.picture ? (
              <DefaultProfilePictureIconWrapper>
                <DefaultProfilePictureIcon />
              </DefaultProfilePictureIconWrapper>
            ) : (
              <UserPicture src={userProfile.picture} alt="user" />
            )}
            <PictureCategoryName>
              {formatMessage({ id: "profilePicture" })}
            </PictureCategoryName>
          </Flex>
        </BoxedLink>
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
        <FakeButton variant={ButtonVariant.PRIMARY}>
          {formatMessage({ id: "updateInfo" })}
        </FakeButton>
      </NeutralLink>
      <h3>{formatMessage({ id: "addressesSection" })}</h3>
      <SectionBox>
        {!userAddresses ? (
          <BoxedLink disableClick={true} href="#">
            <SkeletonTextLine fontSize={1.6} width={50} />
          </BoxedLink>
        ) : (
          <UserAddresses
            hideAddressList={hideAddressList}
            addressList={userAddresses}
          />
        )}
      </SectionBox>
      {userAddresses && userAddresses.length > 1 ? (
        <Flex>
          <ShowMoreButton
            hideList={hideAddressList}
            quantity={userAddresses.length - 1}
            onPress={() => setHideAddressList(!hideAddressList)}
          />
        </Flex>
      ) : null}
      {userAddresses ? (
        <NeutralLink href="/account/profile/addresses/new/">
          <FakeButton variant={ButtonVariant.SECONDARY}>
            + {formatMessage({ id: "addAddress" })}
          </FakeButton>
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
      <BoxedLink disableClick={false} href={href}>
        <CategoryContent>
          <CategoryName>{categoryName}</CategoryName>
          {children}
        </CategoryContent>
      </BoxedLink>
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
    <NoAddressesParagraph>
      {formatMessage({ id: "noAddresses" })}
    </NoAddressesParagraph>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/profile/addresses/${primaryAddress.id}/`}
      >
        <CategoryContent>
          {primaryAddress.kind && (
            <CategoryName>
              {capitalizeFirstLetter(primaryAddress.kind)}
            </CategoryName>
          )}
          <AddressValue isPrimary={primaryAddress.primary}>
            {formatStreetAddressToDisplay(primaryAddress)}
          </AddressValue>
          <AddressValue isPrimary={primaryAddress.primary}>
            {formatOtherAddressFieldsToDisplay(primaryAddress)}
          </AddressValue>
        </CategoryContent>
        <RightChevron />
      </BoxedLink>
      {!hideAddressList && addressList.length > 0 ? (
        <>
          {secondaryAddresses.map((address) => {
            return (
              <React.Fragment key={address.id + address.sub}>
                <Separator />
                <BoxedLink
                  disableClick={false}
                  href={`/account/profile/addresses/${address.id}/`}
                >
                  <CategoryContent>
                    <CategoryName>
                      {capitalizeFirstLetter(address.kind)}
                    </CategoryName>
                    <AddressValue isPrimary={address.primary}>
                      {formatStreetAddressToDisplay(address)}
                    </AddressValue>
                    <AddressValue isPrimary={address.primary}>
                      {formatOtherAddressFieldsToDisplay(address)}
                    </AddressValue>
                  </CategoryContent>
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

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DefaultProfilePictureIconWrapper = styled.div`
  margin-right: 1.6rem;
`;

const UserPicture = styled.img`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: ${({ theme }) => theme.radii[2]};
  margin-right: 1.6rem;
`;

const PictureCategoryName = styled.p`
  color: ${({ theme }) => theme.colors.breadcrumbs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.2rem;
`;

const CategoryName = styled.p`
  color: ${({ theme }) => theme.colors.breadcrumbs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.2rem;
  margin-bottom: 0.7rem;
`;

const CategoryContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NoAddressesParagraph = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

const AddressValue = styled.p<{ isPrimary: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  line-height: ${({ theme }) => theme.lineHeights.copy};

  font-weight: ${({ isPrimary, theme }) =>
    isPrimary && theme.fontWeights.semibold};
`;

export { ProfileOverview };
