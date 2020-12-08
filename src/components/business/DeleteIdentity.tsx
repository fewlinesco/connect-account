import Cookie from "js-cookie";
import { useRouter } from "next/router";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { useCookies } from "@src/hooks/useCookies";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

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
    userId: data.userSub,
    type: getIdentityType(type),
    value: value,
  };

  const deleteMessage = `${
    getIdentityType(type) === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
  } has been deleted`;

  const deleteIdentity = async (): Promise<void> => {
    return fetchJson("/api/delete-identity", HttpVerbs.DELETE, requestData)
      .then(() => {
        Cookie.set("flashMessage", deleteMessage);
      })
      .then(() => {
        router && router.push("/account/logins");
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  return children({ deleteIdentity });
};
