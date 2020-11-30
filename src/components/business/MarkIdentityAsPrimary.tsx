import { useRouter } from "next/router";
import React from "react";

import { Identity } from "@lib/@types";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { fetchJson } from "@src/utils/fetchJson";

interface MarkIdentityAsPrimaryProps {
  identityId: Identity["id"];
  children: (props: {
    markIdentityAsPrimaryCall: () => Promise<void>;
  }) => JSX.Element;
}

export const MarkIdentityAsPrimary: React.FC<MarkIdentityAsPrimaryProps> = ({
  identityId,
  children,
}) => {
  const router = useRouter();

  async function markIdentityAsPrimaryCall(): Promise<void> {
    const body = {
      identityId,
    };

    return fetchJson(
      "/api/auth-connect/mark-identity-as-primary",
      HttpVerbs.POST,
      body,
    )
      .then(() => {
        router && router.push("/account/logins");
      })
      .catch((error) => {
        throw error;
      });
  }

  return children({
    markIdentityAsPrimaryCall,
  });
};
