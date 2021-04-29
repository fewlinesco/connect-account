import React from "react";
import styled from "styled-components";

import { Address, Profile } from "@src/@types/profile";
import { BoxedLink } from "@src/components/boxed-link/boxed-link";
import { ShowMoreButton } from "@src/components/buttons/buttons";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture/default-profile-picture";
import { PlusIcon } from "@src/components/icons/plus-icon/plus-icon";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { Separator } from "@src/components/separator/separator";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const ProfileOverview: React.FC<{
  data?: {
    profileUserInfo: Profile;
    profileAddresses: Address[];
  };
}> = ({ data }) => {
  const [hideAddressList, setHideAddressList] = React.useState<boolean>(true);

  return (
    <>
      <h2>Basic information</h2>
      <SectionBox>
        <BoxedLink disableClick={false} href="#">
          <Flex>
            {!data ? (
              <DefaultProfilePictureIconWrapper>
                <DefaultProfilePictureIcon />
              </DefaultProfilePictureIconWrapper>
            ) : (
              <UserPicture src={data.profileUserInfo.picture} alt="user" />
            )}
            <PictureCategoryName>PROFILE PICTURE</PictureCategoryName>
          </Flex>
          <PlusIcon />
        </BoxedLink>
        <Separator />
        <UserInfoSection categoryName="NAME" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            `${data.profileUserInfo.name} ${data.profileUserInfo.middle_name} ${data.profileUserInfo.family_name}`
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PREFERRED USERNAME" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.preferred_username
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="BIRTH DATE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.birthdate
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="TIME ZONE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.zoneinfo
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="LOCALE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.locale
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="WEBSITE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.website
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PROFILE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.profileUserInfo.profile
          )}
        </UserInfoSection>
      </SectionBox>
      <h2>Addresses</h2>
      <SectionBox>
        {!data ? (
          <BoxedLink disableClick={true} href="#">
            <SkeletonTextLine fontSize={1.6} />
          </BoxedLink>
        ) : (
          <UserAddresses
            hideAddressList={hideAddressList}
            addressList={data.profileAddresses}
          />
        )}
      </SectionBox>
      {data && data.profileAddresses.length > 1 ? (
        <Flex>
          <ShowMoreButton
            hideList={hideAddressList}
            quantity={data.profileAddresses.length - 1}
            setHideList={setHideAddressList}
          />
        </Flex>
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
      <BoxedLink disableClick={false} href="#">
        <CategoryContent>
          <CategoryName>{primaryAddress.kind}</CategoryName>
          <AddressValue
            isPrimary={primaryAddress.primary}
          >{`${primaryAddress.street_address}, ${primaryAddress.street_address_2}`}</AddressValue>
          <AddressValue
            isPrimary={primaryAddress.primary}
          >{`${primaryAddress.postal_code}, ${primaryAddress.region}, ${primaryAddress.locality}, ${primaryAddress.country}`}</AddressValue>
        </CategoryContent>
        <RightChevron />
      </BoxedLink>
      {!hideAddressList && addressList.length > 0 ? (
        <>
          {secondaryAddresses.map(
            ({
              id,
              sub,
              street_address,
              street_address_2,
              locality,
              region,
              postal_code,
              country,
              kind,
              primary,
            }) => {
              return (
                <React.Fragment key={id + sub}>
                  <Separator />
                  <BoxedLink disableClick={false} href="#">
                    <CategoryContent>
                      <CategoryName>{kind}</CategoryName>
                      <AddressValue
                        isPrimary={primary}
                      >{`${street_address}, ${street_address_2}`}</AddressValue>
                      <AddressValue
                        isPrimary={primary}
                      >{`${postal_code}, ${region}, ${locality}, ${country}`}</AddressValue>
                    </CategoryContent>
                    <RightChevron />
                  </BoxedLink>
                </React.Fragment>
              );
            },
          )}
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

  ${({ isPrimary, theme }) => isPrimary && theme.fontWeights.semibold}
`;

export { ProfileOverview };
