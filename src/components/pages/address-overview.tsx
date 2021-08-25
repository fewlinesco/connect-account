import { HttpStatus } from "@fwl/web";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
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

const AddressOverview: React.FC<{ addressToDisplay?: Address }> = ({
  addressToDisplay,
}) => {
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
        {addressToDisplay ? (
          <>
            {addressToDisplay.kind && (
              <p className="text-gray-darker text-m font-medium tracking-widest mb-3">
                {capitalizeFirstLetter(addressToDisplay.kind)}
              </p>
            )}
            <p className="truncate w-11/12 leading-10 font-semibold">
              {formatStreetAddressToDisplay(addressToDisplay)}
            </p>
            <p
              className={`truncate w-11/12 leading-10 font-semibold ${
                addressToDisplay.primary ? "mb-4" : ""
              }`}
            >
              {formatOtherAddressFieldsToDisplay(addressToDisplay)}
            </p>
            {addressToDisplay.primary ? (
              <PrimaryBadge localizedLabel={formatMessage({ id: "primary" })} />
            ) : null}
          </>
        ) : (
          <div className="flex flex-col justify-around h-24">
            <SkeletonTextLine fontSize={1.4} width={40} />
            <SkeletonTextLine fontSize={1.6} width={70} />
          </div>
        )}
      </Box>
      <NeutralLink
        href={
          addressToDisplay
            ? `/account/profile/addresses/${addressToDisplay.id}/edit/`
            : "#"
        }
      >
        <div className="btn btn-primary btn-neutral-link">
          {formatMessage({ id: "update" })}
        </div>
      </NeutralLink>
      {addressToDisplay && !addressToDisplay.primary ? (
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
                  `/api/profile/addresses/${addressToDisplay.id}/mark-as-primary/`,
                  "POST",
                  {},
                ).then(() => {
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
                    ({ id }) => id === addressToDisplay.id,
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
                      addressToMark,
                    );
                  }

                  return router && router.push("/account/profile/");
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
      {isDeletionModalOpen && addressToDisplay ? (
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
              `/api/profile/addresses/${addressToDisplay.id}/`,
              "DELETE",
              {},
            ).then(() => {
              if (addresses) {
                mutate(
                  "/api/profile/addresses/",
                  addresses.filter(({ id }) => id !== addressToDisplay.id),
                );
              }

              return router && router.push("/account/profile/");
            });

            return;
          }}
        />
      ) : null}
    </>
  );
};

export { AddressOverview };
