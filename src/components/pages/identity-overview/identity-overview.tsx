import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { AwaitingValidationBadge, PrimaryBadge } from "@src/components/badges";
import { Box } from "@src/components/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { ConfirmationBox } from "@src/components/confirmation-box/confirmation-box";
import { DeleteConfirmationBoxContent } from "@src/components/confirmation-box/delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "@src/components/confirmation-box/primary-confirmation-box-content";
import { NeutralLink } from "@src/components/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverview: React.FC<{
  identity?: Identity;
}> = ({ identity }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [confirmationBoxOpen, setConfirmationBoxOpen] =
    React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [confirmationBoxContent, setConfirmationBoxContent] =
    React.useState<JSX.Element>(<React.Fragment />);

  return (
    <>
      <Box>
        {!identity ? (
          <Value>
            <SkeletonTextLine fontSize={1.6} width={50} />
          </Value>
        ) : (
          <>
            <Value>
              <p>{identity.value}</p>
            </Value>
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
              <FakeButton variant={ButtonVariant.PRIMARY}>
                {formatMessage({ id: "proceed" })}
              </FakeButton>
            </NeutralLink>
          )}
          {identity.status === "validated" && (
            <NeutralLink
              href={`/account/logins/${identity.type}/${identity.id}/update/`}
            >
              <FakeButton variant={ButtonVariant.PRIMARY}>
                {getIdentityType(identity.type) === IdentityTypes.EMAIL
                  ? formatMessage({ id: "updateEmail" })
                  : formatMessage({ id: "updatePhone" })}
              </FakeButton>
            </NeutralLink>
          )}
          {!identity.primary && identity.status === "validated" && (
            <Button
              type="button"
              variant={ButtonVariant.SECONDARY}
              onPress={() => {
                setPreventAnimation(false);
                setConfirmationBoxContent(
                  <PrimaryConfirmationBoxContent
                    setOpen={setConfirmationBoxOpen}
                    textContent={{
                      infos:
                        getIdentityType(identity.type) === IdentityTypes.EMAIL
                          ? formatMessage({ id: "primaryModalContentEmail" })
                          : formatMessage({ id: "primaryModalContentPhone" }),
                      confirm: formatMessage({ id: "primaryModalConfirm" }),
                      cancel: formatMessage({ id: "primaryModalCancel" }),
                    }}
                    onPress={async () => {
                      await fetchJson(
                        `/api/identities/${identity.id}/mark-as-primary/`,
                        "POST",
                        {},
                      ).then(() => {
                        router && router.push("/account/logins/");
                      });
                    }}
                  />,
                );
                setConfirmationBoxOpen(true);
              }}
            >
              {getIdentityType(identity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "markEmail" })
                : formatMessage({ id: "markPhone" })}
            </Button>
          )}
          {!identity.primary && (
            <Button
              type="button"
              variant={ButtonVariant.GHOST}
              onPress={() => {
                setPreventAnimation(false);
                setConfirmationBoxContent(
                  <DeleteConfirmationBoxContent
                    setOpen={setConfirmationBoxOpen}
                    textContent={{
                      infos:
                        getIdentityType(identity.type) === IdentityTypes.EMAIL
                          ? formatMessage({ id: "deleteModalContentEmail" })
                          : formatMessage({ id: "deleteModalContentPhone" }),
                      confirm: formatMessage({ id: "deleteModalConfirm" }),
                      cancel:
                        getIdentityType(identity.type) === IdentityTypes.EMAIL
                          ? formatMessage({ id: "deleteModalCancelEmail" })
                          : formatMessage({ id: "deleteModalCancelPhone" }),
                    }}
                    onPress={async () => {
                      await fetchJson(
                        `/api/identities/${identity.id}/`,
                        "DELETE",
                        {
                          type: getIdentityType(identity.type),
                          value: identity.value,
                          id: identity.id,
                        },
                      ).then(() => {
                        router && router.push("/account/logins/");
                      });
                    }}
                  />,
                );
                setConfirmationBoxOpen(true);
              }}
            >
              {getIdentityType(identity.type) === IdentityTypes.EMAIL
                ? formatMessage({ id: "deleteEmail" })
                : formatMessage({ id: "deletePhone" })}
            </Button>
          )}
        </>
      ) : null}
      <ConfirmationBox
        open={confirmationBoxOpen}
        setOpen={setConfirmationBoxOpen}
        preventAnimation={preventAnimation}
      >
        {confirmationBoxContent}
      </ConfirmationBox>
    </>
  );
};

const Value = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: ${({ theme }) => theme.spaces.xs} 0;
  word-break: break-all;
`;

export { IdentityOverview };
