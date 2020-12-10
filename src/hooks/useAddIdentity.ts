import { useRouter } from "next/router";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { ErrorSendingValidationCode } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

type UseAddIdentity = {
  errorMessage: string | null;
  addIdentity: (identity: InMemoryTemporaryIdentity) => Promise<void>;
};

export function useAddIdentity(): UseAddIdentity {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();

  async function addIdentity(
    newIdentity: InMemoryTemporaryIdentity,
  ): Promise<void> {
    const body = {
      callbackUrl: "/",
      newIdentity,
    };

    return fetchJson(
      "/api/auth-connect/send-identity-validation-code",
      HttpVerbs.POST,
      body,
    ).then(async (response) => {
      if (response.status >= 400) {
        if (response.statusText === "identity_already_validated") {
          return setErrorMessage(
            "Identity has already been validated by a user",
          );
        }

        if (response.statusText === "can't be blank") {
          return setErrorMessage("Identity value can't be blank");
        }

        throw new ErrorSendingValidationCode();
      }

      if (getIdentityType(newIdentity.type) === IdentityTypes.PHONE) {
        try {
          JSON.parse(newIdentity.value);
        } catch (error) {
          if (error instanceof SyntaxError) {
            return setErrorMessage("Phone identity value should be a number");
          }

          throw error;
        }
      }

      const eventId = await response.json();

      router &&
        router.push(
          `/account/logins/${newIdentity.type}/validation/${eventId.data}`,
        );
    });
  }

  return { errorMessage, addIdentity };
}
