import React from "react";
import styled from "styled-components";

import { Address } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { capitalizeFirstLetter } from "@src/utils/format";

const AddressOverview: React.FC<{ address?: Address }> = ({ address }) => {
  return (
    <>
      <Box>
        {address ? (
          <>
            <CategoryName>{capitalizeFirstLetter(address.kind)}</CategoryName>
            <AddressValue>
              {address.street_address_2
                ? `${address.street_address}, ${address.street_address_2}`
                : address.street_address}
            </AddressValue>
            <AddressValue
              isPrimary={address.primary}
            >{`${address.postal_code}, ${address.region}, ${address.locality}, ${address.country}`}</AddressValue>
            {address.primary ? <PrimaryBadge /> : null}
          </>
        ) : (
          <Flex>
            <SkeletonTextLine fontSize={1.4} width={40} />
            <SkeletonTextLine fontSize={1.6} width={70} />
          </Flex>
        )}
      </Box>
      <NeutralLink
        href={address ? `/account/profile/addresses/${address.id}/edit` : "#"}
      >
        <FakeButton variant={ButtonVariant.PRIMARY}>
          Update this address
        </FakeButton>
      </NeutralLink>
    </>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 6rem;
`;

const CategoryName = styled.p`
  color: ${({ theme }) => theme.colors.lightGrey};
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.2rem;
  margin-bottom: 0.7rem;
`;

const AddressValue = styled.p<{ isPrimary?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  line-height: ${({ theme }) => theme.lineHeights.copy};

  margin-bottom: ${({ isPrimary, theme }) => isPrimary && theme.spaces.xxs};
`;
export { AddressOverview };
