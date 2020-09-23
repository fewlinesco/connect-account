import { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";
import { ProviderUser } from "@src/@types/ProviderUser";
import { SortedIdentities } from "@src/@types/SortedIdentities";

export function sortIdentities(fetchedData: {
  data?: { provider: ProviderUser } | null;
}): SortedIdentities {
  const phoneIdentities: Identity[] = [];
  const emailIdentities: Identity[] = [];
  if (fetchedData.data) {
    const identities: Identity[] = fetchedData.data.provider.user.identities;

    identities.forEach((identity) => {
      if (identity.type === ReceivedIdentityTypes.EMAIL) {
        emailIdentities.push(identity);
      } else if (identity.type === ReceivedIdentityTypes.PHONE) {
        phoneIdentities.push(identity);
      }
    });
  }

  return { phoneIdentities, emailIdentities };
}
