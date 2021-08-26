import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";

import { AwaitingValidationBadge, PrimaryBadge } from "@src/components/badges";
import { Box } from "@src/components/boxes";
import { Button } from "@src/components/buttons";
import { Modal, ModalVariant } from "@src/components/modals";
import { NeutralLink } from "@src/components/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverview: React.FC<{
  identity?: Identity;
}> = ({ identity }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const [isMarkAsPrimaryModalOpen, setIsMarkAsPrimaryModalOpen] =
    React.useState<boolean>(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] =
    React.useState<boolean>(false);

  return (
    <>
      <Box>
        {!identity ? (
          <div className="text-bold my-8 break-all">
            <SkeletonTextLine fontSize={1.6} width={50} responsive={true} />
          </div>
        ) : (
          <>
            <div className="font-bold my-8 break-all">
              <p>{identity.value}</p>
            </div>
            {identity.primary && identity.status === "validated" ? (
              <PrimaryBadge
                localizedLabel={formatMessage(
                  { id: "primary" },
                  { identityType: identity.type },
                )}
              />
            ) : null}
            {identity.status === "validated" ? (
              <React.Fragment />
            ) : (
              <AwaitingValidationBadge
                localizedLabel={formatMessage({ id: "awaiting" })}
              />
            )}
          </>
        )}
      </Box>
      {identity ? (
        <>
          {identity.status === "unvalidated" && (
            <NeutralLink href={`/account/logins/${identity.type}/validation/`}>
              <div className="btn btn-primary btn-neutral-link">
                {formatMessage({ id: "proceed" })}
              </div>
            </NeutralLink>
          )}
          {identity.status === "validated" && (
            <NeutralLink
              href={`/account/logins/${identity.type}/${identity.id}/update/`}
            >
              <div className="btn btn-primary btn-neutral-link">
                {getIdentityType(identity.type) === IdentityTypes.EMAIL
                  ? formatMessage({ id: "updateEmail" })
                  : formatMessage({ id: "updatePhone" })}
              </div>
            </NeutralLink>
          )}
          {!identity.primary && identity.status === "validated" && (
            <Button
              type="button"
              className="btn btn-secondary"
              onPress={() => {
                setIsDeletionModalOpen(false);
                setIsMarkAsPrimaryModalOpen(true);
                return;
              }}
            >
              {getIdentityType(identity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "markEmail" })
                : formatMessage({ id: "markPhone" })}
            </Button>
          )}
          {isMarkAsPrimaryModalOpen ? (
            <Modal
              variant={ModalVariant.MARK_AS_PRIMARY}
              textContent={{
                info:
                  getIdentityType(identity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "primaryModalContentEmail" })
                    : formatMessage({ id: "primaryModalContentPhone" }),
                confirm: formatMessage({ id: "primaryModalConfirm" }),
                cancel: formatMessage({ id: "primaryModalCancel" }),
              }}
              setIsModalOpen={setIsMarkAsPrimaryModalOpen}
              onConfirmationPress={async () => {
                await fetchJson(
                  `/api/identities/${identity.id}/mark-as-primary/`,
                  "POST",
                  {},
                ).then(() => {
                  router && router.push("/account/logins/");
                });
              }}
            />
          ) : null}
          {!identity.primary && (
            <Button
              type="button"
              className="btn btn-ghost"
              onPress={() => {
                setIsMarkAsPrimaryModalOpen(false);
                setIsDeletionModalOpen(true);
              }}
            >
              {getIdentityType(identity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "deleteEmail" })
                : formatMessage({ id: "deletePhone" })}
            </Button>
          )}
          {isDeletionModalOpen ? (
            <Modal
              variant={ModalVariant.DELETION}
              textContent={{
                info:
                  getIdentityType(identity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "deleteModalContentEmail" })
                    : formatMessage({ id: "deleteModalContentPhone" }),
                confirm: formatMessage({ id: "deleteModalConfirm" }),
                cancel:
                  getIdentityType(identity.type) === IdentityTypes.EMAIL
                    ? formatMessage({ id: "deleteModalCancelEmail" })
                    : formatMessage({ id: "deleteModalCancelPhone" }),
              }}
              setIsModalOpen={setIsDeletionModalOpen}
              onConfirmationPress={async () => {
                await fetchJson(`/api/identities/${identity.id}/`, "DELETE", {
                  type: getIdentityType(identity.type),
                  value: identity.value,
                  id: identity.id,
                }).then(() => {
                  router && router.push("/account/logins/");
                });
              }}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export { IdentityOverview };
