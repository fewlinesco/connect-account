import { Identity } from "@lib/@types";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { fetchJson } from "@src/utils/fetchJson";

export async function markIdentityAsPrimaryCall(
  identityId: Identity["id"],
): Promise<Response> {
  const body = {
    identityId,
  };

  return fetchJson(
    "/api/auth-connect/mark-identity-as-primary",
    HttpVerbs.POST,
    body,
  ).catch((error) => {
    throw error;
  });
}
