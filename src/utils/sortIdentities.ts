import { Identity, IdentityTypes } from "@lib/@types";
import type { ProviderUser } from "@lib/@types/ProviderUser";
import type { SortedIdentities } from "@src/@types/SortedIdentities";

export function sortIdentities(fetchedData: {
  data?: { provider: ProviderUser } | null;
}): SortedIdentities {
  const phoneIdentities: Identity[] = [];
  const emailIdentities: Identity[] = [];

  if (fetchedData.data) {
    const identities: Identity[] = fetchedData.data.provider.user.identities;

    identities.forEach((identity) => {
      const identityPattern = {
        id: identity.id,
        primary: identity.primary,
        status: identity.status,
        value: identity.value,
      };
      const identityType = identity.type.toUpperCase();
      if (identityType === IdentityTypes.EMAIL) {
        emailIdentities.push({
          ...identityPattern,
          type: IdentityTypes.EMAIL,
        });
      } else if (identityType === IdentityTypes.PHONE) {
        phoneIdentities.push({
          ...identityPattern,
          type: IdentityTypes.PHONE,
        });
      }
    });
  }

  function sortPrimary(a: Identity, b: Identity): number {
    return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
  }

  phoneIdentities.sort(sortPrimary);
  emailIdentities.sort(sortPrimary);

  return { phoneIdentities, emailIdentities };
}
