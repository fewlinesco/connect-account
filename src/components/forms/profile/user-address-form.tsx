import { HttpStatus } from "@fwl/web";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../../input/form-error-message";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Address } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";

type AddressInputErrors = {
  country?: string;
  locality?: string;
  postal_code?: string;
};

type AddressPayload = Omit<
  Address,
  "id" | "sub" | "created_at" | "updated_at" | "primary"
>;

async function updateOrCreateAddress(
  router: NextRouter,
  setErrorFunction: React.Dispatch<React.SetStateAction<AddressInputErrors>>,
  addressPayload: AddressPayload,
  addressId?: string,
): Promise<void> {
  const url = addressId
    ? `/api/profile/addresses/${addressId}`
    : "/api/profile/addresses";
  const method = addressId ? "PATCH" : "POST";

  return fetchJson(url, method, addressPayload).then(async (response) => {
    const parsedResponse = await response.json();

    if (
      response.status === HttpStatus.CREATED ||
      response.status === HttpStatus.OK
    ) {
      router && router.push("/account/profile");
      return;
    } else if (
      response.status === HttpStatus.UNPROCESSABLE_ENTITY &&
      parsedResponse &&
      parsedResponse.details
    ) {
      setErrorFunction(parsedResponse.details);
    } else {
      throw new Error("Something went wrong");
    }
  });
}

const UserAddressForm: React.FC<{
  userAddress?: Address;
  isCreation?: boolean;
}> = ({ userAddress, isCreation }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errors, setErrors] = React.useState<AddressInputErrors>({});

  const [address, setAddress] = React.useState<Address>({
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

          await updateOrCreateAddress(
            router,
            setErrors,
            addressPayload,
            userAddress?.id,
          );

          setFormID(uuidv4());
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
          required
        />
        {errors.locality && (
          <FormErrorMessage>{errors.locality}</FormErrorMessage>
        )}
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
          required
        />
        {errors.postal_code && (
          <FormErrorMessage>{errors.postal_code}</FormErrorMessage>
        )}
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
          required
        />
        {errors.country && (
          <FormErrorMessage>{errors.country}</FormErrorMessage>
        )}
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
