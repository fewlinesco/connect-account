import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Address } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

const EditUserAddressForm: React.FC<{
  userAddress?: Address;
}> = ({ userAddress }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());

  const [updatedAddress, setUpdatedAddress] = React.useState<Address>({
    id: "",
    sub: "",
    street_address: "string",
    locality: "string",
    region: "string",
    postal_code: "string",
    country: "string",
    kind: "string",
    created_at: "string",
    updated_at: "string",
    street_address_2: "string",
    primary: false,
  });

  React.useEffect(() => {
    if (userAddress) {
      setUpdatedAddress(userAddress);
    }
  }, [userAddress]);

  return (
    <>
      <Form
        formID={formID}
        onSubmit={async () => {
          setFormID(uuidv4());
          return;
        }}
      >
        <InputText
          type="text"
          name="street-address"
          placeholder="Enter your street address"
          value={updatedAddress.street_address}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              street_address: value,
            });
          }}
          label="Street address *"
        />
        <InputText
          type="text"
          name="street-address-2"
          placeholder="Enter your complementary street address"
          value={updatedAddress.street_address_2}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              street_address_2: value,
            });
          }}
          label="Complementary street address"
        />
        <InputText
          type="text"
          name="locality"
          placeholder="Enter your locality"
          value={updatedAddress.locality}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              locality: value,
            });
          }}
          label="Locality *"
        />
        <InputText
          type="text"
          name="region"
          placeholder="Enter your region"
          value={updatedAddress.region}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              region: value,
            });
          }}
          label="Region *"
        />
        <InputText
          type="text"
          name="postal-code"
          placeholder="Enter your postal code"
          value={updatedAddress.postal_code}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              postal_code: value,
            });
          }}
          label="Postal code *"
        />
        <InputText
          type="text"
          name="country"
          placeholder="Enter your country"
          value={updatedAddress.country}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              country: value,
            });
          }}
          label="Country *"
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

export { EditUserAddressForm };
