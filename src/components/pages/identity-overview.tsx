import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import { mutate } from "swr";

import { AwaitingValidationBadge, PrimaryBadge } from "@src/components/badges";
import { Box } from "@src/components/boxes";
import { Button } from "@src/components/buttons";
import { Modal, ModalVariant } from "@src/components/modals";
import { NeutralLink } from "@src/components/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverview: React.FC<{
  identities?: Identity[];
}> = ({ identities }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const [isMarkAsPrimaryModalOpen, setIsMarkAsPrimaryModalOpen] =
    React.useState<boolean>(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] =
    React.useState<boolean>(false);

  const currentIdentity = identities?.find(({ id }) => router.query.id === id);
  const primaryIdentity = currentIdentity
    ? identities?.find(
        ({ type, primary }) =>
          currentIdentity.type === type && primary === true,
      )
    : undefined;

  return (
    <>
      <Box>
        {!currentIdentity ? (
          <div className="text-bold my-8 break-all">
            <SkeletonTextLine fontSize={1.6} width={50} responsive={true} />
          </div>
        ) : (
          <>
            <div className="font-bold my-8 break-all">
              <p>{currentIdentity.value}</p>
            </div>
            {currentIdentity.primary &&
            currentIdentity.status === "validated" ? (
              <PrimaryBadge
                localizedLabel={formatMessage(
                  { id: "primary" },
                  { identityType: currentIdentity.type },
                )}
              />
            ) : null}
            {currentIdentity.status === "validated" ? (
              <React.Fragment />
            ) : (
              <AwaitingValidationBadge
                localizedLabel={formatMessage({ id: "awaiting" })}
              />
            )}
          </>
        )}
      </Box>
      {currentIdentity ? (
        <>
          {currentIdentity.status === "unvalidated" && (
            <NeutralLink
              href={`/account/logins/${currentIdentity.type}/validation/`}
            >
              <div className="btn btn-primary btn-neutral-link">
                {formatMessage({ id: "proceed" })}
              </div>
            </NeutralLink>
          )}
          {currentIdentity.status === "validated" && (
            <NeutralLink
              href={`/account/logins/${currentIdentity.type}/${currentIdentity.id}/update/`}
            >
              <div className="btn btn-primary btn-neutral-link">
                {getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                  ? formatMessage({ id: "updateEmail" })
                  : formatMessage({ id: "updatePhone" })}
              </div>
            </NeutralLink>
          )}
          {!currentIdentity.primary && currentIdentity.status === "validated" && (
            <Button
              type="button"
              className="btn btn-secondary"
              onPress={() => {
                setIsDeletionModalOpen(false);
                setIsMarkAsPrimaryModalOpen(true);
                return;
              }}
            >
              {getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "markEmail" })
                : formatMessage({ id: "markPhone" })}
            </Button>
          )}
          {isMarkAsPrimaryModalOpen ? (
            <Modal
              variant={ModalVariant.MARK_AS_PRIMARY}
              textContent={{
                info:
                  getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "primaryModalContentEmail" })
                    : formatMessage({ id: "primaryModalContentPhone" }),
                confirm: formatMessage({ id: "primaryModalConfirm" }),
                cancel: formatMessage({ id: "primaryModalCancel" }),
              }}
              setIsModalOpen={setIsMarkAsPrimaryModalOpen}
              onConfirmationPress={async () => {
                await fetchJson(
                  `/api/identities/${currentIdentity.id}/mark-as-primary/`,
                  "POST",
                  {},
                ).then(() => {
                  if (identities) {
                    mutate(
                      "/api/identities/",
                      identities.map((identity) => {
                        if (identity.id === currentIdentity.id) {
                          return { ...identity, primary: true };
                        }

                        if (
                          primaryIdentity &&
                          identity.id === primaryIdentity.id
                        ) {
                          return { ...identity, primary: false };
                        }

                        return identity;
                      }),
                    );
                  }

                  return router && router.push("/account/logins/");
                });
              }}
            />
          ) : null}
          {!currentIdentity.primary && (
            <Button
              type="button"
              className="btn btn-ghost"
              onPress={() => {
                setIsMarkAsPrimaryModalOpen(false);
                setIsDeletionModalOpen(true);
              }}
            >
              {getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "deleteEmail" })
                : formatMessage({ id: "deletePhone" })}
            </Button>
          )}
          {isDeletionModalOpen ? (
            <Modal
              variant={ModalVariant.DELETION}
              textContent={{
                info:
                  getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "deleteModalContentEmail" })
                    : formatMessage({ id: "deleteModalContentPhone" }),
                confirm: formatMessage({ id: "deleteModalConfirm" }),
                cancel:
                  getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "deleteModalCancelEmail" })
                    : formatMessage({ id: "deleteModalCancelPhone" }),
              }}
              setIsModalOpen={setIsDeletionModalOpen}
              onConfirmationPress={async () => {
                await fetchJson(
                  `/api/identities/${currentIdentity.id}/`,
                  "DELETE",
                  {
                    type: getIdentityType(currentIdentity.type),
                    value: currentIdentity.value,
                    id: currentIdentity.id,
                  },
                ).then(() => {
                  if (identities) {
                    mutate(
                      "/api/identities/",
                      identities.filter(({ id }) => id !== currentIdentity.id),
                    );
                  }

                  return router && router.push("/account/logins/");
                });

                return;
              }}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export { IdentityOverview };
