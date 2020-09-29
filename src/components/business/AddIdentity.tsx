import React from "react";

import { HttpVerbs } from "@src/@types/HttpVerbs";
import type { ReceivedIdentityTypes } from "@src/@types/Identity";
import { useCookies } from "@src/hooks/useCookies";
import { fetchJson } from "@src/utils/fetchJson";

interface AddIdentityProps {
  type: ReceivedIdentityTypes;
  children: (props: {
    addIdentity: (value: string) => Promise<Response>;
    type: ReceivedIdentityTypes;
  }) => JSX.Element;
}

export const AddIdentity: React.FC<AddIdentityProps> = ({ type, children }) => {
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
