import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { ConfirmationBox } from "./ConfirmationBox";
import { DeleteConfirmationText } from "./DeleteConfirmationBoxContent";
import { PrimaryConfirmationText } from "./PrimaryConfirmationBoxContent";
import { deviceBreakpoints } from "@src/design-system/theme";

export default {
  title: "components/Confirmation Box",
  component: ConfirmationBox,
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);

  return (
    <ConfirmationStoryContainer>
      <Button
        variant={ButtonVariant.PRIMARY}
        onClick={() => {
          setPreventAnimation(false);
          setOpen(!open);
        }}
      >
        Show confirmation box
      </Button>
      <ConfirmationBox
        open={open}
        setOpen={setOpen}
        preventAnimation={preventAnimation}
      >
        <>
          <PrimaryConfirmationText>
            You are about to replace mail@mail.com as your main address
          </PrimaryConfirmationText>
          <Button variant={ButtonVariant.PRIMARY}>
            Set mail2@mail.com as my main
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant={ButtonVariant.SECONDARY}
          >
            Keep mail@mail.co as my primary email
          </Button>
        </>
      </ConfirmationBox>
    </ConfirmationStoryContainer>
  );
};

export const DangerConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);

  return (
    <ConfirmationStoryContainer>
      <div>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => {
            setPreventAnimation(false);
            setOpen(!open);
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
        <>
          <DeleteConfirmationText>
            You are about to delete mail@mail.co
          </DeleteConfirmationText>
          <Button variant={ButtonVariant.DANGER}>
            Delete this email address
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant={ButtonVariant.SECONDARY}
          >
            Keep email address
          </Button>
        </>
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
