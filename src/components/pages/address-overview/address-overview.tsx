import React from "react";
import styled from "styled-components";

import { Address } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import {
  ConfirmationBox,
  useConfirmationBox,
} from "@src/components/confirmation-box/confirmation-box";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import {
  capitalizeFirstLetter,
  formatOtherAddressFieldsToDisplay,
  formatStreetAddressToDisplay,
} from "@src/utils/format";

const AddressOverview: React.FC<{ address?: Address }> = ({ address }) => {
  const {
    confirmationBoxOpen,
    preventAnimation,
    setConfirmationBoxOpen,
    setPreventAnimation,
  } = useConfirmationBox();

  return (
    <>
      <Box>
        {address ? (
          <>
            <CategoryName>{capitalizeFirstLetter(address.kind)}</CategoryName>
            <AddressValue>{formatStreetAddressToDisplay(address)}</AddressValue>
            <AddressValue isPrimary={address.primary}>
              {formatOtherAddressFieldsToDisplay(address)}
            </AddressValue>
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
      <Button
        type="button"
        variant={ButtonVariant.SECONDARY}
        onClick={() => {
          setPreventAnimation(false);
          setConfirmationBoxOpen(true);
        }}
      >
        Use this address as my main address
      </Button>

      <ConfirmationBox
        open={confirmationBoxOpen}
        setOpen={setConfirmationBoxOpen}
        preventAnimation={preventAnimation}
      >
        <>
          <p>You are about to set this address as main.</p>

          <Button
            type="button"
            variant={ButtonVariant.PRIMARY}
            onClick={() => {
              alert("DONE");
            }}
          >
            Confirm
          </Button>

          <Button
            type="button"
            variant={ButtonVariant.SECONDARY}
            onClick={() => {
              setConfirmationBoxOpen(false);
            }}
          >
            Cancel
          </Button>
        </>
      </ConfirmationBox>
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
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  margin-bottom: ${({ isPrimary, theme }) => isPrimary && theme.spaces.xxs};
`;
export { AddressOverview };
