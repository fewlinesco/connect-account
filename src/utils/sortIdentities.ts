import { ProviderUser } from "src/@types/ProviderUser";

import { IdentityTypes, Identity } from "../@types/Identity";
import { SortedIdentities } from "../@types/SortedIdentities";

export function sortIdentities(fetchedData: {
  data?: { provider: ProviderUser } | null;
}): SortedIdentities {
  if (fetchedData.data) {
    const identities: Identity[] = fetchedData.data.provider.user.identities;
    const phoneIdentities: Identity[] = [];
    const emailIdentities: Identity[] = [];

    identities.forEach((identity) => {
      if (identity.type === IdentityTypes.EMAIL.toLowerCase()) {
        emailIdentities.push(identity);
      } else if (identity.type === IdentityTypes.PHONE.toLowerCase()) {
        phoneIdentities.push(identity);
      }
    });

    return { phoneIdentities, emailIdentities };
  }

  return { phoneIdentities: [], emailIdentities: [] };
}
