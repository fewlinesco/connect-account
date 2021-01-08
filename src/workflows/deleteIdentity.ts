import Cookie from "js-cookie";

import { IdentityTypes } from "@lib/@types";
import { HttpVerbs } from "@src/@types/core/http-verbs";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

export const deleteIdentity = async (
  userId: string,
  type: IdentityTypes,
  value: string,
): Promise<void> => {
  const requestData = {
    userId,
    type: getIdentityType(type),
    value,
  };

  const deleteMessage = `${
    getIdentityType(type) === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
  } has been deleted`;

  return fetchJson("/api/delete-identity", HttpVerbs.DELETE, requestData)
    .then(() => {
      Cookie.set("flashMessage", deleteMessage);
    })
    .catch((error) => {
      throw error;
    });
};
