import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../../input/input-text";
// import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "../form";
import { Address } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

const UpdateUserAddressForm: React.FC<{ userAddress?: Address }> = ({
  userAddress,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [
    updatedStreetAddress,
    setUpdatedStreetAddress,
  ] = React.useState<string>("");
  const [
    updatedStreetAddress2,
    setUpdatedStreetAddress2,
  ] = React.useState<string>("");

  React.useEffect(() => {
    if (userAddress) {
      setUpdatedStreetAddress(userAddress.street_address);
      setUpdatedStreetAddress2(userAddress.street_address_2);
    }
  }, [userAddress]);

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
          placeholder="Enter your street address"
          value={updatedStreetAddress}
          onChange={(value) => {
            setUpdatedStreetAddress(value);
          }}
          label="Name *"
        />
        <InputText
          type="text"
          name="name"
          placeholder="Enter your complementary street address"
          value={updatedStreetAddress2}
          onChange={(value) => {
            setUpdatedStreetAddress2(value);
          }}
          label="Name *"
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update my address
        </Button>
      </Form>
      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UpdateUserAddressForm };
