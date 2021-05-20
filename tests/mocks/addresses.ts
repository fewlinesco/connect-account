import { Address } from "@src/@types/profile";

const primaryAddress: Address = {
  id: "0087969e-9a0e-4e24-b38c-45a7e89f2bc1",
  sub: "edc29cc7-35d5-4409-850a-dab5e19beb58",
  street_address: "905 Macejkovic Prairie",
  locality: "Kautzerbury",
  region: "Massachusetts",
  postal_code: "76369-4333",
  country: "Gambia",
  kind: "nemo",
  created_at: "2021-04-15T07:35:28.614Z",
  updated_at: "2021-04-15T07:35:28.614Z",
  street_address_2: "Suite 309",
  primary: true,
};

const nonPrimaryAddress: Address = {
  id: "3bb53df5-3cfb-480b-8667-7e0f092c6ac1",
  sub: "edc29cc7-35d5-4409-850a-dab5e19beb58",
  street_address: "46974 Price Drives",
  locality: "Port Jasminshire",
  region: "Washington",
  postal_code: "35501-1717",
  country: "Western Sahara",
  kind: "labore",
  created_at: "2021-04-15T07:35:28.599Z",
  updated_at: "2021-04-15T07:35:28.599Z",
  street_address_2: "Apt. 098",
  primary: false,
};

export { primaryAddress, nonPrimaryAddress };
