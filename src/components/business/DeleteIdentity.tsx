import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "../../@types/HttpVerbs";
import { IdentityTypes } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { fetchJson } from "../../utils/fetchJson";

interface DeleteIdentityProps {
  type: IdentityTypes;
  value: string;
  children: (props: { deleteIdentity: () => Promise<void> }) => JSX.Element;
}

export const DeleteIdentity: React.FC<DeleteIdentityProps> = ({
  type,
  value,
  children,
}) => {
  const { data, error } = useCookies();
  const router = useRouter();

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  const requestData = {
    userId: data.userId,
    type: type,
    value: value,
  };

  const deleteIdentity = async (): Promise<void> => {
    return fetchJson("/api/account", HttpVerbs.DELETE, requestData).then(() => {
      router.push("/account/logins/");
    });
  };

  return children({ deleteIdentity });
};
