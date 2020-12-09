import { getIdentityType } from "./getIdentityType";
import { Identity, IdentityTypes } from "@lib/@types";
import type { ProviderUser } from "@lib/@types/ProviderUser";
import type { SortedIdentities } from "@src/@types/SortedIdentities";

export function sortIdentities(fetchedData: {
  data?: { provider: ProviderUser } | null;
}): SortedIdentities {
  const phoneIdentities: Identity[] = [];
  const emailIdentities: Identity[] = [];
  const socialIdentities: Identity[] = [];

  if (fetchedData.data) {
    const identities: Identity[] = fetchedData.data.provider.user.identities;

    identities.forEach((identity) => {
      try {
        const identityPattern = {
          id: identity.id,
          primary: identity.primary,
          status: identity.status,
          value: identity.value,
        };

        if (getIdentityType(identity.type) === IdentityTypes.EMAIL) {
          emailIdentities.push({
            ...identityPattern,
            type: IdentityTypes.EMAIL,
          });
        } else if (getIdentityType(identity.type) === IdentityTypes.PHONE) {
          phoneIdentities.push({
            ...identityPattern,
            type: IdentityTypes.PHONE,
          });
        } else if (getIdentityType(identity.type) !== IdentityTypes.PROVIDER) {
          socialIdentities.push({
            ...identityPattern,
            type: getIdentityType(identity.type),
          });
        }
      } catch (error) {
        // if type unknown ID
        // return

        throw error;
      }
    });
  }

  function sortPrimary(a: Identity, b: Identity): number {
    return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
  }

  phoneIdentities.sort(sortPrimary);
  emailIdentities.sort(sortPrimary);
  socialIdentities.sort(sortPrimary);

  return { phoneIdentities, emailIdentities, socialIdentities };
}
