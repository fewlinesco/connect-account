import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputsRadio } from "../input/input-radio-button";
import { Form } from "./form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { capitalizeFirstLetter } from "@src/utils/format";

const UpdateGenderForm: React.FC<{ profileGender?: Profile["gender"] }> = ({
  profileGender,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [selectedGender, setSelectedGender] = React.useState<
    Profile["gender"] | null
  >(null);

  console.log(profileGender);

  React.useEffect(() => {
    if (profileGender) {
      setSelectedGender(capitalizeFirstLetter(profileGender));
    }
  }, [profileGender]);

  return (
    <>
      {/* {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null} */}
      <Form
        formID={formID}
        onSubmit={async () => {
          setFormID(uuidv4());
          return;
        }}
      >
        <GenderInputsRadio
          groupName="genderChoice"
          inputsValues={["Male", "Female"]}
          selectedInput={selectedGender ? selectedGender : ""}
          onChange={({ target }) => {
            setSelectedGender(capitalizeFirstLetter(target.value));
          }}
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update gender
        </Button>
      </Form>
      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

const GenderInputsRadio = styled(InputsRadio)`
  margin-bottom: ${({ theme }) => theme.spaces.xs};
`;

export { UpdateGenderForm };
