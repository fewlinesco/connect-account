import React from "react";

import { HttpVerbs } from "../../@types/HttpVerbs";
import { IdentityTypes } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { fetchJson } from "../../utils/fetchJson";

interface AddIdentityProps {
  type: IdentityTypes;
  children: (props: {
    addIdentity: (value: string) => Promise<Response>;
    type: IdentityTypes;
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
      userId: data.userId,
      type: type.toUpperCase(),
      value,
    };

    return fetchJson("/api/identity", HttpVerbs.POST, body);
  };

  return children({
    addIdentity,
    type,
  });
};
