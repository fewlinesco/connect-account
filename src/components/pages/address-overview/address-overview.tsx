import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Address } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { ConfirmationBox } from "@src/components/confirmation-box/confirmation-box";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { fetchJson } from "@src/utils/fetch-json";
import {
  capitalizeFirstLetter,
  formatOtherAddressFieldsToDisplay,
  formatStreetAddressToDisplay,
} from "@src/utils/format";

const AddressOverview: React.FC<{ address?: Address }> = ({ address }) => {
  const router = useRouter();
  const [confirmationBoxOpen, setConfirmationBoxOpen] =
    React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
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
        variant={ButtonVariant.GHOST}
        onClick={() => {
          setPreventAnimation(false);
          setConfirmationBoxOpen(true);
        }}
      >
        Delete this address
      </Button>

      <ConfirmationBox
        open={confirmationBoxOpen}
        setOpen={setConfirmationBoxOpen}
        preventAnimation={preventAnimation}
      >
        <>
          <p>You are about to delete this address.</p>

          <Button
            type="button"
            variant={ButtonVariant.PRIMARY}
            onClick={() => {
              fetchJson(`/api/profile/addresses/${address?.id}`, "DELETE", {})
                .then(() => router && router.push("/account/profile"))
                .catch((error) => {
                  throw error;
                });
            }}
          >
            Delete this address
          </Button>

          <Button
            type="button"
            variant={ButtonVariant.SECONDARY}
            onClick={() => {
              setConfirmationBoxOpen(false);
            }}
          >
            Keep address
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
