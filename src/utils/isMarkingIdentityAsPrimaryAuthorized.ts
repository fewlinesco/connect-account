import { getIdentities } from "@lib/queries/getIdentities";

export async function isMarkingIdentityAsPrimaryAuthorized(
  sub: string,
  identityId: string,
): Promise<boolean> {
  const managementResponse = await getIdentities(sub);

  const identities = managementResponse.data?.provider.user.identities;

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}
