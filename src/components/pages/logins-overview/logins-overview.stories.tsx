import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import { SWRConfig } from "swr";

import { LoginsOverview } from "./logins-overview";
import { SortedIdentities } from "@src/@types/sorted-identities";
import { StoriesContainer } from "@src/components/containers/stories-container";

const sortedIdentities: SortedIdentities = {
  phoneIdentities: [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.PHONE,
      value: "0622116655",
    },
    {
      id: "jht5dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.PHONE,
      value: "0622116633",
    },
    {
      id: "jht5dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "unvalidated",
      type: IdentityTypes.PHONE,
      value: "0622116622",
    },
  ],
  emailIdentities: [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test@test.test",
    },
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test1@test.test",
    },
    {
      id: "91gercc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "unvalidated",
      type: IdentityTypes.EMAIL,
      value: "test2@test.test",
    },
  ],
  socialIdentities: [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.GITHUB,
      value: "",
    },
    {
      id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.FACEBOOK,
      value: "",
    },
  ],
};

const Populated = (): JSX.Element => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        fetcher: () => {
          return {
            sortedIdentities,
          };
        },
      }}
    >
      <StoriesContainer>
        <LoginsOverview />
      </StoriesContainer>
    </SWRConfig>
  );
};

const Empty = (): JSX.Element => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        fetcher: () => {
          return {
            sortedIdentities: {
              phoneIdentities: [],
              emailIdentities: [],
              socialIdentities: [],
            },
          };
        },
      }}
    >
      <StoriesContainer>
        <LoginsOverview />
      </StoriesContainer>
    </SWRConfig>
  );
};

export { Populated, Empty };
export default { title: "pages/Logins Overview", component: LoginsOverview };
