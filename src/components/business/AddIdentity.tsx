import { useRouter } from "next/router";
import React from "react";

import type { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { ErrorSendingValidationCode } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

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
    try {
      const body = {
        callbackUrl: "/",
        identityInput: identity,
      };

      const eventId = await fetchJson(
        "/api/auth-connect/send-identity-validation-code",
        HttpVerbs.POST,
        body,
      ).then((response) => {
        if (response.status >= 400) {
          if (response.statusText === "identity_already_validated") {
            return "Identity already used";
          }

          throw new ErrorSendingValidationCode();
        }

        return response.json();
      });

      router &&
        router.push(`/account/logins/${type}/validation/${eventId.data}`);
    } catch (error) {
      router && router.push("/account/logins/email/new");
    }
  }

  return children({
    addIdentity,
  });
};
