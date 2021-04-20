type Profile = {
  sub: string;
  name: string;
  family_name: string;
  given_name: string;
  middle_name: string;
  nickname: string;
  preferred_username: string;
  profile: string;
  picture: string;
  website: string;
  gender: string;
  zoneinfo: string;
  locale: string;
  birthdate: string;
  updated_at: string;
};

type Address = {
  id: string;
  sub: string;
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  kind: string;
  created_at: string;
  updated_at: string;
  street_address_2: string;
  primary: boolean;
};

export type { Profile, Address };
