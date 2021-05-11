import { useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Address } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";

const UpdateUserAddressForm: React.FC<{
  userAddress?: Address;
}> = ({ userAddress }) => {
  const [formID] = React.useState<string>(uuidv4());

  const [updatedAddress, setUpdatedAddress] = React.useState<Address>({
    id: "",
    sub: "",
    street_address: "",
    locality: "",
    region: "",
    postal_code: "",
    country: "",
    kind: "",
    created_at: "",
    updated_at: "",
    street_address_2: "",
    primary: false,
  });

  const router = useRouter();

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
          await fetchJson(
            `/api/profile/addresses/${updatedAddress.id}`,
            "PATCH",
            {
              userAddressPayload: updatedAddress,
            },
          ).then(async (response) => {
            const parsedResponse = await response.json();

            if ("updatedUserAddress" in parsedResponse) {
              router &&
                router.push(`/account/profile/addresses/${updatedAddress.id}`);
              return;
            }

            throw new Error("Something went wrong");
          });
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
        <InputText
          type="text"
          name="kind"
          placeholder="Enter your address kind"
          value={updatedAddress.kind}
          onChange={(value) => {
            setUpdatedAddress({
              ...updatedAddress,
              kind: value,
            });
          }}
          label="Kind"
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update my address
        </Button>
      </Form>
      <NeutralLink href={`/account/profile/addresses/${updatedAddress.id}`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UpdateUserAddressForm };
