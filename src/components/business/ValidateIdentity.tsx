import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import {
  InvalidValidationCode,
  TemporaryIdentityExpired,
} from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

interface ValidateIdentity {
  eventId: string;
  children: (props: {
    validateIdentity: (validationCode: string) => Promise<void>;
  }) => JSX.Element;
}

export const ValidateIdentity: React.FC<ValidateIdentity> = ({
  eventId,
  children,
}) => {
  const router = useRouter();

  async function validateIdentity(validationCode: string): Promise<void> {
    return await fetchJson(
      "/api/auth-connect/verify-validation-code",
      HttpVerbs.POST,
      { validationCode, eventId },
    ).then(async (response) => {
      if (response.status >= 400) {
        if (response.statusText === "INVALID") {
          throw new InvalidValidationCode("Invalid validation code");
        }

        if (response.statusText === "Temporary Identity Expired") {
          throw new TemporaryIdentityExpired();
        }
      }

      const path = new URL(response.url).pathname;

      router && router.push(path);
    });
  }

  return children({
    validateIdentity,
  });
};
