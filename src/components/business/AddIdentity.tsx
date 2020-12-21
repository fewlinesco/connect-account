import { useRouter } from "next/router";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import {
  ErrorSendingValidationCode,
  IdentityAlreadyUsed,
  IdentityInputValueCantBeBlank,
  PhoneNumberInputValueShouldBeANumber,
} from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

interface AddIdentityProps {
  type: IdentityTypes;
  children: (props: {
    addIdentity: (identity: InMemoryTemporaryIdentity) => Promise<void>;
  }) => JSX.Element;
}

export const AddIdentity: React.FC<AddIdentityProps> = ({ type, children }) => {
  const router = useRouter();

  async function addIdentity(
    identity: InMemoryTemporaryIdentity,
  ): Promise<void> {
    const body = {
      callbackUrl: "/",
      identityInput: identity,
    };

    return fetchJson(
      "/api/auth-connect/send-identity-validation-code",
      HttpVerbs.POST,
      body,
    ).then(async (response) => {
      if (response.status >= 400) {
        console.log(response);
        const { error } = await response.json();

        if (error === "identity_already_validated") {
          throw new IdentityAlreadyUsed(
            "Identity has already been validated by a user",
          );
        }

        if (error === "can't be blank") {
          throw new IdentityInputValueCantBeBlank(
            "Identity value can't be blank",
          );
        }

        throw new ErrorSendingValidationCode();
      }

      if (getIdentityType(type) === IdentityTypes.PHONE) {
        try {
          JSON.parse(identity.value);
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new PhoneNumberInputValueShouldBeANumber(
              "Phone identity value should be a number",
            );
          }

          throw error;
        }
      }

      const eventId = await response.json();

      router &&
        router.push(`/account/logins/${type}/validation/${eventId.data}`);
    });
  }

  return children({
    addIdentity,
  });
};
