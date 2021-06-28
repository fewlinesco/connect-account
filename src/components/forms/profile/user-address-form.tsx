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

const UserAddressForm: React.FC<{
  userAddress?: Address;
  isCreation?: boolean;
}> = ({ userAddress, isCreation }) => {
  const [formID] = React.useState<string>(uuidv4());

  const [address, setAddress] = React.useState<Address>({} as Address);

  const router = useRouter();

  React.useEffect(() => {
    if (userAddress) {
      setAddress(userAddress);
    }
  }, [userAddress]);

  return (
    <>
      <Form
        formID={formID}
        onSubmit={async () => {
          const addressPayload = {
            street_address: address.street_address,
            locality: address.locality,
            region: address.region,
            postal_code: address.postal_code,
            country: address.country,
            kind: address.kind,
            street_address_2: address.street_address_2,
          };

          if (isCreation) {
            return fetchJson(
              "/api/profile/addresses",
              "POST",
              addressPayload,
            ).then(async (response) => {
              const parsedResponse = await response.json();

              if ("createdAddress" in parsedResponse) {
                router && router.push("/account/profile");
                return;
              }

              throw new Error("Something went wrong");
            });
          }

          return fetchJson(
            `/api/profile/addresses/${address.id}`,
            "PATCH",
            addressPayload,
          ).then(async (response) => {
            const parsedResponse = await response.json();

            if ("updatedUserAddress" in parsedResponse) {
              router && router.push(`/account/profile/addresses/${address.id}`);
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
          value={address.street_address}
          onChange={(value) => {
            setAddress({
              ...address,
              street_address: value,
            });
          }}
          label="Street address"
        />
        <InputText
          type="text"
          name="street-address-2"
          placeholder="Enter your complementary street address"
          value={address.street_address_2}
          onChange={(value) => {
            setAddress({
              ...address,
              street_address_2: value,
            });
          }}
          label="Complementary street address"
        />
        <InputText
          type="text"
          name="locality"
          placeholder="Enter your locality"
          value={address.locality}
          onChange={(value) => {
            setAddress({
              ...address,
              locality: value,
            });
          }}
          label="Locality *"
        />
        <InputText
          type="text"
          name="postal-code"
          placeholder="Enter your postal code"
          value={address.postal_code}
          onChange={(value) => {
            setAddress({
              ...address,
              postal_code: value,
            });
          }}
          label="Postal code *"
        />
        <InputText
          type="text"
          name="region"
          placeholder="Enter your region"
          value={address.region}
          onChange={(value) => {
            setAddress({
              ...address,
              region: value,
            });
          }}
          label="Region"
        />
        <InputText
          type="text"
          name="country"
          placeholder="Enter your country"
          value={address.country}
          onChange={(value) => {
            setAddress({
              ...address,
              country: value,
            });
          }}
          label="Country *"
        />
        <InputText
          type="text"
          name="kind"
          placeholder="Enter your address kind"
          value={address.kind}
          onChange={(value) => {
            setAddress({
              ...address,
              kind: value,
            });
          }}
          label="Kind"
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          {isCreation ? "Add address" : "Update my address"}
        </Button>
      </Form>
      <NeutralLink
        href={
          isCreation
            ? "/account/profile"
            : `/account/profile/addresses/${address.id}`
        }
      >
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UserAddressForm };
