import React from "react";
import styled from "styled-components";

import { Address, Profile } from "@src/@types/profile";
import { BoxedLink } from "@src/components/boxed-link/boxed-link";
import { ButtonVariant, ShowMoreButton } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture/default-profile-picture";
import { PlusIcon } from "@src/components/icons/plus-icon/plus-icon";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { Separator } from "@src/components/separator/separator";
import { SectionBox } from "@src/components/shadow-box/section-box";
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

  return (
    <>
      <h2>Basic information</h2>
      <SectionBox>
        <BoxedLink disableClick={false} href="#">
          <Flex>
            {!userProfile ? (
              <DefaultProfilePictureIconWrapper>
                <DefaultProfilePictureIcon />
              </DefaultProfilePictureIconWrapper>
            ) : (
              <UserPicture src={userProfile.picture} alt="user" />
            )}
            <PictureCategoryName>PROFILE PICTURE</PictureCategoryName>
          </Flex>
          <PlusIcon />
        </BoxedLink>
        <Separator />
        <UserInfoSection categoryName="NAME" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            `${userProfile.name} ${userProfile.middle_name} ${userProfile.family_name}`
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PREFERRED USERNAME" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.preferred_username
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="BIRTH DATE" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.birthdate
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="TIME ZONE" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.zoneinfo
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="LOCALE" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.locale
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="WEBSITE" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.website
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PROFILE" href="#">
          {!userProfile ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            userProfile.profile
          )}
        </UserInfoSection>
      </SectionBox>
      <NeutralLink href={"/account/profile/user-profile/edit"}>
        <FakeButton variant={ButtonVariant.PRIMARY}>
          Update your personal information
        </FakeButton>
      </NeutralLink>
      <h2>Addresses</h2>
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
            setHideList={setHideAddressList}
          />
        </Flex>
      ) : null}
      {userAddresses ? (
        <NeutralLink href="/account/profile/addresses/new">
          <FakeButton variant={ButtonVariant.SECONDARY}>
            + Add new address
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
        <RightChevron />
      </BoxedLink>
      <Separator />
    </>
  );
};

const UserAddresses: React.FC<{
  hideAddressList: boolean;
  addressList: Address[];
}> = ({ hideAddressList, addressList }) => {
  const primaryAddress = addressList.find((address) => address.primary);
  const secondaryAddresses = addressList.filter(
    (address) => address.primary === false,
  );

  return !primaryAddress ? (
    <NoAddressesParagraph>No addresses added yet</NoAddressesParagraph>
  ) : (
    <>
      <BoxedLink
        disableClick={false}
        href={`/account/profile/addresses/${primaryAddress.id}`}
      >
        <CategoryContent>
          <CategoryName>
            {capitalizeFirstLetter(primaryAddress.kind)}
          </CategoryName>
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
                  href={`/account/profile/addresses/${address.id}`}
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
  color: ${({ theme }) => theme.colors.lightGrey};
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.2rem;
`;

const CategoryName = styled.p`
  color: ${({ theme }) => theme.colors.lightGrey};
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
