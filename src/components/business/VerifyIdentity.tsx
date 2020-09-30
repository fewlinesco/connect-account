import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "@src/@types/HttpVerbs";
import { fetchJson } from "@src/utils/fetchJson";

interface VerifyIdentity {
  eventId: string;
  children: (props: {
    verifyIdentity: (validationCode: string) => Promise<void>;
  }) => JSX.Element;
}

export const VerifyIdentity: React.FC<VerifyIdentity> = ({
  eventId,
  children,
}) => {
  const router = useRouter();

  async function verifyIdentity(validationCode: string): Promise<void> {
    const response = await fetchJson(
      "/api/auth-connect/verify-validation-code",
      HttpVerbs.POST,
      { validationCode, eventId },
    );

    if (response.status >= 400) {
      router && router.push("/account/logins/email/new");
    } else {
      const path = new URL(response.url).pathname;

      router && router.push(path);
    }
  }

  return children({
    verifyIdentity,
  });
};
