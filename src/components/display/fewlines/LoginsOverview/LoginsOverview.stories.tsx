import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { LoginsOverview } from "./LoginsOverview";
import { IdentityTypes } from "@lib/@types";
import { SortedIdentities } from "@src/@types/sorted-identities";

export default { title: "pages/Logins Overview", component: LoginsOverview };

export const LoginsOverviewPage = (): JSX.Element => {
  const mockedSortedResponse: SortedIdentities = {
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
    socialIdentities: [],
  };

  return (
    <StoriesContainer>
      <LoginsOverview sortedIdentities={mockedSortedResponse} />
    </StoriesContainer>
  );
};
