import React from "react";

import { HttpVerbs } from "../../@types/HttpVerbs";
import type { ReceivedIdentityTypes } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { fetchJson } from "../../utils/fetchJson";

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

  return children({ addIdentity, type });
};
