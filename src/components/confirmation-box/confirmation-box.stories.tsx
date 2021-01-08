import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../button/button";
import { Container } from "../containers/container";
import { ConfirmationBox } from "./confirmation-box";
import { DeleteConfirmationBoxContent } from "./delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "./primary-confirmation-box-content";
import { IdentityTypes } from "@lib/@types";
import { deviceBreakpoints } from "@src/design-system/theme";

export default {
  title: "components/Confirmation Box",
  component: ConfirmationBox,
};

const identity = {
  type: IdentityTypes.EMAIL,
  value: "test@fewlines.test",
  id: "1234567890",
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  return (
    <ConfirmationStoryContainer>
      <Button
        variant={ButtonVariant.PRIMARY}
        onClick={() => {
          setPreventAnimation(false);
          setOpen(!open);
          setConfirmationBoxContent(
            <PrimaryConfirmationBoxContent
              setOpen={setOpen}
              value={identity.value}
              id={identity.id}
            />,
          );
        }}
      >
        Show confirmation box
      </Button>
      <ConfirmationBox
        open={open}
        setOpen={setOpen}
        preventAnimation={preventAnimation}
      >
        {confirmationBoxContent}
      </ConfirmationBox>
    </ConfirmationStoryContainer>
  );
};

export const DangerConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  const userId = "12345-67890-e1234-ad67890-az12345";

  return (
    <ConfirmationStoryContainer>
      <div>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => {
            setPreventAnimation(false);
            setOpen(!open);
            setConfirmationBoxContent(
              <DeleteConfirmationBoxContent
                setOpen={setOpen}
                value={identity.value}
                type={identity.type}
                userId={userId}
              />,
            );
          }}
        >
          Show confirmation box
        </Button>
      </div>
      <ConfirmationBox
        open={open}
        setOpen={setOpen}
        preventAnimation={preventAnimation}
      >
        {confirmationBoxContent}
      </ConfirmationBox>
    </ConfirmationStoryContainer>
  );
};

const ConfirmationStoryContainer = styled(Container)`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 100%;
  }
`;
