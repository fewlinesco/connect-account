import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";
import { Container } from "../containers/container";
import { ConfirmationBox } from "./confirmation-box";
import { DeleteConfirmationBoxContent } from "./delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "./primary-confirmation-box-content";
import { deviceBreakpoints } from "@src/design-system/theme";

const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  const identity = {
    type: IdentityTypes.EMAIL,
    value: "test@fewlines.test",
    id: "1234567890",
  };

  return (
    <ConfirmationStoryContainer>
      <Button
        type="button"
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

const DangerConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  const identity = {
    type: IdentityTypes.EMAIL,
    value: "test@fewlines.test",
    id: "1234567890",
  };

  return (
    <ConfirmationStoryContainer>
      <div>
        <Button
          type="button"
          variant={ButtonVariant.PRIMARY}
          onClick={() => {
            setPreventAnimation(false);
            setOpen(!open);
            setConfirmationBoxContent(
              <DeleteConfirmationBoxContent
                setOpen={setOpen}
                value={identity.value}
                type={identity.type}
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

export default {
  title: "components/Confirmation Box",
  component: ConfirmationBox,
};
export { PrimaryConfirmationBox, DangerConfirmationBox };
