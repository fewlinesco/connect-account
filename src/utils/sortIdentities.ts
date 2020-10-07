import { IdentityTypes } from "@lib/@types";
import { Identity } from "@lib/@types";
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
      const identityType = identity.type.toUpperCase();
      if (identityType === IdentityTypes.EMAIL) {
        emailIdentities.push({
          id: identity.id,
          primary: identity.primary,
          status: identity.status,
          type: IdentityTypes.EMAIL,
          value: identity.value,
        });
      } else if (identityType === IdentityTypes.PHONE) {
        phoneIdentities.push({
          id: identity.id,
          primary: identity.primary,
          status: identity.status,
          type: IdentityTypes.PHONE,
          value: identity.value,
        });
      }
    });
  }

  return { phoneIdentities, emailIdentities };
}
