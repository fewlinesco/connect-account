import { IdentityTypes } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const deleteIdentity = async (
  userId: string,
  type: IdentityTypes,
  value: string,
): Promise<Response> => {
  const requestData = {
    userId,
    type: getIdentityType(type),
    value,
  };

  return fetchJson("/api/delete-identity", HttpVerbs.DELETE, requestData);
};

export { deleteIdentity };
