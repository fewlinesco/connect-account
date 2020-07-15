import { Identity } from "./Identity";

export type ProviderUser = {
    id: string;
    name: string
    user: {
      id : string
      identities: Identity[]
    }
  }