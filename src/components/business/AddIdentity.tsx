import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "@src/@types/HttpVerbs";
import type {
  InMemoryTemporaryIdentity,
  ReceivedIdentityTypes,
} from "@src/@types/Identity";
import { fetchJson } from "@src/utils/fetchJson";

interface AddIdentityProps {
  type: ReceivedIdentityTypes;
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

    const eventId = await fetchJson(
      "/api/auth-connect/send-identity-validation-code",
      HttpVerbs.POST,
      body,
    ).then((response) => {
      if (response.status >= 400) {
        return router && router.push("/account/logins/email/new");
      }

      return response.json();
    });

    router && router.push(`/account/logins/${type}/validation/${eventId.data}`);
  }

  return children({
    addIdentity,
  });
};
