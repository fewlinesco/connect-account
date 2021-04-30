import "react-day-picker/lib/style.css";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";

import { InputDatePicker } from "../input/input-date-picker";
import { InputDayPicker } from "../input/input-day-picker";
import { InputText } from "../input/input-text";
// import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

const UpdateUserProfileForm: React.FC<{ userProfileData?: Profile }> = ({
  userProfileData,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [updatedName, setUpdatedName] = React.useState<string>("");
  const [updatedUsername, setUpdatedUsername] = React.useState<string>("");
  const [birthdate, setBirthdate] = React.useState<string>("");

  React.useEffect(() => {
    if (userProfileData) {
      setUpdatedName(
        `${userProfileData.name} ${userProfileData.middle_name} ${userProfileData.family_name}`,
      );
      setUpdatedUsername(userProfileData.preferred_username);
      setBirthdate(userProfileData.birthdate);
    }
  }, [userProfileData]);

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
        <InputText
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={updatedName}
          onChange={(value) => {
            setUpdatedName(value);
          }}
          label="Name *"
        />
        <InputText
          type="text"
          name="username"
          placeholder="Enter your username"
          value={updatedUsername}
          onChange={(value) => {
            setUpdatedUsername(value);
          }}
          label="Username"
        />
        <InputDatePicker
          label={"react-datepicker"}
          selected={birthdate !== "" ? birthdate : undefined}
          onChange={(date) => {
            setBirthdate(date.toLocaleDateString("en-EN"));
          }}
        />
        <InputDayPicker
          label={"react-day-picker"}
          selected={birthdate !== "" ? birthdate : undefined}
          onChange={(date) => {
            setBirthdate(date.toLocaleDateString("en-EN"));
          }}
        />
        <Label>
          Native input element
          <input
            type="date"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            placeholder="YYYY-MM-DD"
          />
        </Label>
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update my information
        </Button>
      </Form>
      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

const Label = styled.label`
  display: flex;
  flex-direction: column;
  input {
    margin-top: 1rem;
    background: ${({ theme }) => theme.colors.background};
    border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
    border-radius: ${({ theme }) => theme.radii[0]};
    height: 4rem;
    padding-left: 1.6rem;
    width: 100%;
    margin: ${({ theme }) => theme.spaces.xxs} 0 0;
    z-index: 1;
    position: relative;
  }
`;

export { UpdateUserProfileForm };
