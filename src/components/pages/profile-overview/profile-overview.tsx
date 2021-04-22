import React from "react";
import styled from "styled-components";

import { BoxedLink } from "../logins-overview/logins-overview";
import { Address, Profile } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges/badges";
import { ShowMoreButton } from "@src/components/buttons/buttons";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture/default-profile-picture";
import { PlusIcon } from "@src/components/icons/plus-icon/plus-icon";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { Separator } from "@src/components/separator/separator";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const ProfileOverview: React.FC<{
  data?: {
    userInfo: {
      profile: Profile;
      addresses: Address[];
    };
  };
}> = ({ data }) => {
  const [hideAddressList, setHideAddressList] = React.useState<boolean>(true);

  return (
    <>
      <h2>Basic information</h2>
      <SectionBox>
        <PictureBoxedLink disableClick={false} href="#">
          <Flex>
            {!data ? (
              <DefaultProfilePictureIconWrapper>
                <DefaultProfilePictureIcon />
              </DefaultProfilePictureIconWrapper>
            ) : (
              <UserPicture src={data.userInfo.profile.picture} alt="user" />
            )}
            <PictureCategoryName>PROFILE PICTURE</PictureCategoryName>
          </Flex>
          <PlusIcon />
        </PictureBoxedLink>
        <Separator />
        <UserInfoSection categoryName="NAME" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            `${data.userInfo.profile.name} ${data.userInfo.profile.middle_name} ${data.userInfo.profile.family_name}`
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PREFERRED USERNAME" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.preferred_username
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="BIRTH DATE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.birthdate
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="TIME ZONE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.zoneinfo
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="LOCALE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.locale
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="WEBSITE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.website
          )}
        </UserInfoSection>
        <UserInfoSection categoryName="PROFILE" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            data.userInfo.profile.profile
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
            addressList={data.userInfo.addresses}
          />
        )}
      </SectionBox>
      {data && data.userInfo.addresses.length > 1 ? (
        <Flex>
          <ShowMoreButton
            hideList={hideAddressList}
            quantity={data.userInfo.addresses.length - 1}
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
      <AddressBoxedLink
        disableClick={false}
        href="#"
        primary={primaryAddress.primary}
      >
        <AddressContent>
          <CategoryName>{primaryAddress.kind}</CategoryName>
          <AddressValue>{`${primaryAddress.street_address}, ${primaryAddress.street_address_2}`}</AddressValue>
          <AddressValue>{`${primaryAddress.postal_code}, ${primaryAddress.region}, ${primaryAddress.locality}, ${primaryAddress.country}`}</AddressValue>
          <PrimaryBadge />
        </AddressContent>
        <RightChevron />
      </AddressBoxedLink>
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
                  <AddressBoxedLink
                    disableClick={false}
                    href="#"
                    primary={primary}
                  >
                    <AddressContent>
                      <CategoryName>{kind}</CategoryName>
                      <AddressValue>{`${street_address}, ${street_address_2}`}</AddressValue>
                      <AddressValue>{`${postal_code}, ${region}, ${locality}, ${country}`}</AddressValue>
                    </AddressContent>
                    <RightChevron />
                  </AddressBoxedLink>
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

const PictureBoxedLink = styled(BoxedLink)`
  height: 8rem;
`;

const AddressBoxedLink = styled(BoxedLink)<{
  primary: boolean;
}>`
  height: auto !important;
  padding: ${({ theme }) => `1.5rem ${theme.spaces.xs} 0 ${theme.spaces.xs}`};

  ${({ primary }) => !primary && `padding-bottom: 1.5rem !important;`}
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
  display: flex;
  flex-direction: column;
`;

const AddressContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NoAddressesParagraph = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

const AddressValue = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  line-height: ${({ theme }) => theme.lineHeights.copy};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export { ProfileOverview };
