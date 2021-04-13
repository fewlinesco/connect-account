import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import {
  AwaitingValidationBadge,
  PrimaryBadge,
} from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { ConfirmationBox } from "@src/components/confirmation-box/confirmation-box";
import { DeleteConfirmationBoxContent } from "@src/components/confirmation-box/delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "@src/components/confirmation-box/primary-confirmation-box-content";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverview: React.FC<{
  data?: { identity: Identity };
}> = ({ data }) => {
  const [confirmationBoxOpen, setConfirmationBoxOpen] = React.useState<boolean>(
    false,
  );
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  return (
    <>
      <Box>
        {!data ? (
          <Value>
            <SkeletonTextLine fontSize={1.6} />
          </Value>
        ) : (
          <>
            <Value>
              <p>{data.identity.value}</p>
            </Value>
            {data.identity.primary && data.identity.status === "validated" ? (
              <PrimaryBadge />
            ) : null}
            {data.identity.status === "validated" ? (
              <React.Fragment />
            ) : (
              <AwaitingValidationBadge />
            )}
          </>
        )}
      </Box>
      {data ? (
        <>
          {data.identity.status === "unvalidated" && (
            <NeutralLink
              href={`/account/logins/${data.identity.type}/validation`}
            >
              <FakeButton variant={ButtonVariant.PRIMARY}>
                Proceed to validation
              </FakeButton>
            </NeutralLink>
          )}
          {data.identity.status === "validated" && (
            <NeutralLink
              href={`/account/logins/${data.identity.type}/${data.identity.id}/update`}
            >
              <FakeButton variant={ButtonVariant.PRIMARY}>
                Update this{" "}
                {getIdentityType(data.identity.type) === IdentityTypes.PHONE
                  ? "phone number"
                  : "email address"}
              </FakeButton>
            </NeutralLink>
          )}
          {!data.identity.primary && data.identity.status === "validated" && (
            <Button
              type="button"
              variant={ButtonVariant.SECONDARY}
              onClick={() => {
                setPreventAnimation(false);
                setConfirmationBoxContent(
                  <PrimaryConfirmationBoxContent
                    setOpen={setConfirmationBoxOpen}
                    value={data.identity.value}
                    id={data.identity.id}
                  />,
                );
                setConfirmationBoxOpen(true);
              }}
            >
              Make {data.identity.value} my primary{" "}
              {data.identity.type.toLowerCase()}
            </Button>
          )}
          {!data.identity.primary && (
            <Button
              type="button"
              variant={ButtonVariant.GHOST}
              onClick={() => {
                setPreventAnimation(false);
                setConfirmationBoxContent(
                  <DeleteConfirmationBoxContent
                    setOpen={setConfirmationBoxOpen}
                    value={data.identity.value}
                    type={data.identity.type}
                  />,
                );
                setConfirmationBoxOpen(true);
              }}
            >
              Delete this{" "}
              {getIdentityType(data.identity.type) === IdentityTypes.PHONE
                ? "phone number"
                : "email address"}
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
