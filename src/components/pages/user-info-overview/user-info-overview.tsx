import React from "react";
import styled from "styled-components";

import { BoxedLink } from "../logins-overview/logins-overview";
import { Address, Profile } from "@src/@types/profile";
import { DefaultProfilePictureIcon } from "@src/components/icons/default-profile-picture/default-profile-picture";
import { PlusIcon } from "@src/components/icons/plus-icon/plus-icon";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { Separator } from "@src/components/separator/separator";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const UserInfoOverview: React.FC<{
  data?: {
    userInfo: {
      profile: Profile;
      addresses: Address[];
    };
  };
}> = ({ data }) => {
  return (
    <>
      <h2>Basic information</h2>
      <SectionBox>
        <PictureBoxedLink disableClick={false} href="#">
          <Flex>
            {!data ? (
              <DefaultProfilePictureIcon />
            ) : (
              <UserPicture src={data.userInfo.profile.picture} alt="user" />
            )}
            <CategoryName>PROFILE PICTURE</CategoryName>
          </Flex>
          <PlusIcon />
        </PictureBoxedLink>
        <Separator />
        <UserInfoSection categoryName="NAME" href="#">
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            `${data.userInfo.profile.name} ${data.userInfo.profile.family_name}`
          )}
        </UserInfoSection>
      </SectionBox>
    </>
  );
};

const UserInfoSection: React.FC<{
  categoryName: string;
  href: string;
}> = ({ categoryName, href, children }) => {
  return (
    <BoxedLink disableClick={false} href={href}>
      <CategoryContent>
        <CategoryName>{categoryName}</CategoryName>
        {children}
      </CategoryContent>
      <RightChevron />
    </BoxedLink>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const PictureBoxedLink = styled(BoxedLink)`
  height: 8rem !important;
`;

const UserPicture = styled.img`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: ${({ theme }) => theme.radii[2]};
  margin-right: 1.6rem;
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

export { UserInfoOverview };
