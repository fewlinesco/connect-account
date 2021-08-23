import { HttpStatus } from "@fwl/web";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { Modal, ModalVariant } from "../modals";
import { Address } from "@src/@types/profile";
import { PrimaryBadge } from "@src/components/badges";
import { Box } from "@src/components/boxes";
import { Button } from "@src/components/buttons";
import { NeutralLink } from "@src/components/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons";
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

  const [isMarkAsPrimaryModalOpen, setIsMarkAsPrimaryModalOpen] =
    React.useState<boolean>(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] =
    React.useState<boolean>(false);

  const { data: addresses } = useSWR<Address[], SWRError>(
    "/api/profile/addresses/",
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
        href={address ? `/account/profile/addresses/${address.id}/edit/` : "#"}
      >
        <div className="btn btn-primary btn-neutral-link">
          {formatMessage({ id: "update" })}
        </div>
      </NeutralLink>
      {address && !address.primary ? (
        <>
          <Button
            type="button"
            className="btn btn-secondary"
            onPress={() => {
              setIsDeletionModalOpen(false);
              setIsMarkAsPrimaryModalOpen(true);
              return;
            }}
          >
            {formatMessage({ id: "mark" })}
          </Button>
          {isMarkAsPrimaryModalOpen ? (
            <Modal
              variant={ModalVariant.MARK_AS_PRIMARY}
              textContent={{
                info: formatMessage({ id: "infoMark" }),
                confirm: formatMessage({ id: "confirm" }),
                cancel: formatMessage({ id: "cancel" }),
              }}
              setIsModalOpen={setIsMarkAsPrimaryModalOpen}
              onConfirmationPress={async () => {
                await fetchJson(
                  `/api/profile/addresses/${address?.id}/mark-as-primary/`,
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
                      mutate("/api/profile/addresses/", modifiedAddresses);
                      mutate(
                        `/api/profile/addresses/${oldMarkedAddress.id}/`,
                        oldMarkedAddress,
                      );
                      mutate(
                        `/api/profile/addresses/${addressToMark.id}/`,
                        oldMarkedAddress,
                      );
                    }

                    router && router.push("/account/profile/");
                  })
                  .catch((error) => {
                    throw error;
                  });

                return;
              }}
            />
          ) : null}
        </>
      ) : null}
      <Button
        type="button"
        className="btn btn-ghost"
        onPress={() => {
          setIsMarkAsPrimaryModalOpen(false);
          setIsDeletionModalOpen(true);
        }}
      >
        {formatMessage({ id: "delete" })}
      </Button>
      {isDeletionModalOpen ? (
        <Modal
          variant={ModalVariant.DELETION}
          textContent={{
            info: formatMessage({ id: "infoDelete" }),
            confirm: formatMessage({ id: "deleteButton" }),
            cancel: formatMessage({ id: "keep" }),
          }}
          setIsModalOpen={setIsDeletionModalOpen}
          onConfirmationPress={async () => {
            await fetchJson(
              `/api/profile/addresses/${address?.id}/`,
              "DELETE",
              {},
            )
              .then(async () => {
                if (addresses && address) {
                  const addressToDelete = addresses.find(
                    (a) => a.id === address.id,
                  );
                  if (addressToDelete) {
                    const index = addresses.indexOf(addressToDelete);
                    const modifiedAddresses = [...addresses];
                    modifiedAddresses.splice(index, 1);
                    await mutate("/api/profile/addresses/", modifiedAddresses);
                  }
                }
                router && router.push("/account/profile/");
              })
              .catch((error) => {
                throw error;
              });

            return;
          }}
        />
      ) : null}
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
  color: ${({ theme }) => theme.colors.breadcrumbs};
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
