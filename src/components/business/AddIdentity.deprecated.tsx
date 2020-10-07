import React from "react";

import type { IdentityTypes } from "@lib/@types";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { useCookies } from "@src/hooks/useCookies";
import { fetchJson } from "@src/utils/fetchJson";

interface AddIdentityProps {
  type: IdentityTypes;
  children: (props: {
    addIdentity: (value: string) => Promise<Response>;
    type: IdentityTypes;
  }) => JSX.Element;
}

export const AddIdentity_Deprecated: React.FC<AddIdentityProps> = ({
  type,
  children,
}) => {
  const { data, error } = useCookies();

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  const addIdentity = (value: string): Promise<Response> => {
    const body = {
      userId: data.userSub,
      type: type.toUpperCase(),
      value,
    };

    return fetchJson("/api/identities", HttpVerbs.POST, body);
  };

  return children({
    addIdentity,
    type,
  });
};
