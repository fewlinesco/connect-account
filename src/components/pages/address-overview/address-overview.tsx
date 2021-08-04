import { HttpStatus } from "@fwl/web";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { Address } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { ConfirmationBox } from "@src/components/confirmation-box/confirmation-box";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { SWRError } from "@src/errors/errors";
import { fetchJson } from "@src/utils/fetch-json";
import {
  capitalizeFirstLetter,
  formatOtherAddressFieldsToDisplay,
  formatStreetAddressToDisplay,
} from "@src/utils/format";

const AddressOverview: React.FC<{ address?: Address }> = ({ address }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [primaryConfirmationBoxOpen, setPrimaryConfirmationBoxOpen] =
    React.useState<boolean>(false);
  const [deleteConfirmationBoxOpen, setDeleteConfirmationBoxOpen] =
    React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);

  const { data: addresses } = useSWR<Address[], SWRError>(
    "/api/profile/addresses",
    async (url) => {
      return await fetch(url).then(async (response) => {
        if (!response.ok) {
          const error = new SWRError(
            "An error occurred while fetching the data.",
          );

          if (response.status === HttpStatus.NOT_FOUND) {
            error.info = await response.json();
            error.statusCode = response.status;
            return;
          }

          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      });
    },
  );

  return (
    <>
      <Box>
        {address ? (
          <>
            {address.kind && (
              <CategoryName>{capitalizeFirstLetter(address.kind)}</CategoryName>
            )}
            <AddressValue>{formatStreetAddressToDisplay(address)}</AddressValue>
            <AddressValue isPrimary={address.primary}>
              {formatOtherAddressFieldsToDisplay(address)}
            </AddressValue>
            {address.primary ? (
              <PrimaryBadge localizedLabel={formatMessage({ id: "primary" })} />
            ) : null}
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
          {formatMessage({ id: "update" })}
        </FakeButton>
      </NeutralLink>
      {address ? (
        address.primary ? null : (
          <>
            <Button
              type="button"
              variant={ButtonVariant.SECONDARY}
              onPress={() => {
                setPreventAnimation(false);
                setPrimaryConfirmationBoxOpen(true);
              }}
            >
              {formatMessage({ id: "mark" })}
            </Button>
            <ConfirmationBox
              open={primaryConfirmationBoxOpen}
              setOpen={setPrimaryConfirmationBoxOpen}
              preventAnimation={preventAnimation}
            >
              <>
                <p>{formatMessage({ id: "infoMark" })}</p>
                <Button
                  type="button"
                  variant={ButtonVariant.PRIMARY}
                  onPress={() => {
                    fetchJson(
                      `/api/profile/addresses/${address?.id}/mark-as-primary`,
                      "POST",
                      {},
                    )
                      .then(() => {
                        const modifiedAddresses = [
                          ...(addresses || ([] as Address[])),
                        ];
                        const oldMarkedAddress = modifiedAddresses.find(
                          (address) => address.primary,
                        );
                        modifiedAddresses.forEach(
                          (address) => (address.primary = false),
                        );
                        const addressToMark = modifiedAddresses.find(
                          (a) => a.id === address.id,
                        );
                        if (addressToMark && oldMarkedAddress) {
                          addressToMark.primary = true;
                          mutate("/api/profile/addresses", modifiedAddresses);
                          mutate(
                            `/api/profile/addresses/${oldMarkedAddress.id}`,
                            oldMarkedAddress,
                          );
                          mutate(
                            `/api/profile/addresses/${addressToMark.id}`,
                            oldMarkedAddress,
                          );
                        }

                        router && router.push("/account/profile/");
                      })
                      .catch((error) => {
                        throw error;
                      });
                  }}
                >
                  {formatMessage({ id: "confirm" })}
                </Button>
                <Button
                  type="button"
                  variant={ButtonVariant.SECONDARY}
                  onPress={() => {
                    setPrimaryConfirmationBoxOpen(false);
                  }}
                >
                  {formatMessage({ id: "cancel" })}
                </Button>
              </>
            </ConfirmationBox>
          </>
        )
      ) : null}
      <Button
        type="button"
        variant={ButtonVariant.GHOST}
        onPress={() => {
          setPreventAnimation(false);
          setDeleteConfirmationBoxOpen(true);
        }}
      >
        {formatMessage({ id: "delete" })}
      </Button>
      <ConfirmationBox
        open={deleteConfirmationBoxOpen}
        setOpen={setDeleteConfirmationBoxOpen}
        preventAnimation={preventAnimation}
      >
        <>
          <p>{formatMessage({ id: "infoDelete" })}</p>
          <Button
            type="button"
            variant={ButtonVariant.PRIMARY}
            onPress={() => {
              fetchJson(`/api/profile/addresses/${address?.id}`, "DELETE", {})
                .then(async () => {
                  if (addresses && address) {
                    const addressToDelete = addresses.find(
                      (a) => a.id === address.id,
                    );
                    if (addressToDelete) {
                      const index = addresses.indexOf(addressToDelete);
                      const modifiedAddresses = [...addresses];
                      modifiedAddresses.splice(index, 1);
                      await mutate("/api/profile/addresses", modifiedAddresses);
                    }
                  }
                  router && router.push("/account/profile/");
                })
                .catch((error) => {
                  throw error;
                });
            }}
          >
            {formatMessage({ id: "deleteButton" })}
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.SECONDARY}
            onPress={() => {
              setDeleteConfirmationBoxOpen(false);
            }}
          >
            {formatMessage({ id: "keep" })}
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
