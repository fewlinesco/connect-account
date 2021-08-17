import React from "react";

import { Button, ButtonVariant } from "../buttons/buttons";
import { ConfirmationBox } from "./confirmation-box";
import { DeleteConfirmationBoxContent } from "./delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "./primary-confirmation-box-content";

const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [confirmationBoxContent, setConfirmationBoxContent] =
    React.useState<JSX.Element>(<React.Fragment />);

  return (
    <div className="container mx-auto lg:w-3/5">
      <Button
        type="button"
        variant={ButtonVariant.PRIMARY}
        onPress={() => {
          setPreventAnimation(false);
          setOpen(!open);
          setConfirmationBoxContent(
            <PrimaryConfirmationBoxContent
              setOpen={setOpen}
              textContent={{
                infos: "You are about to set this email address as primary.",
                confirm: "Confirm",
                cancel: "Cancel",
              }}
              onPress={() => window.alert("DONE")}
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
    </div>
  );
};

const DangerConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [confirmationBoxContent, setConfirmationBoxContent] =
    React.useState<JSX.Element>(<React.Fragment />);

  return (
    <div className="container mx-auto lg:w-3/5">
      <div>
        <Button
          type="button"
          variant={ButtonVariant.PRIMARY}
          onPress={() => {
            setPreventAnimation(false);
            setOpen(!open);
            setConfirmationBoxContent(
              <DeleteConfirmationBoxContent
                setOpen={setOpen}
                textContent={{
                  infos: "You are about to delete this email address.",
                  confirm: "Delete",
                  cancel: "Keep this email address",
                }}
                onPress={() => window.alert("Done")}
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
    </div>
  );
};

export default {
  title: "components/Confirmation Box",
  component: ConfirmationBox,
};
export { PrimaryConfirmationBox, DangerConfirmationBox };
