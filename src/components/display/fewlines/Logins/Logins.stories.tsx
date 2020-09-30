import React from "react";

import Logins from "./Logins";
import { ReceivedIdentityTypes } from "@src/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";

export default { title: "Logins", component: Logins };

export const StandardLogins = (): JSX.Element => {
  const mockedSortedResponse: SortedIdentities = {
    phoneIdentities: [
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: ReceivedIdentityTypes.PHONE,
        value: "0622116655",
      },
    ],
    emailIdentities: [
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: ReceivedIdentityTypes.EMAIL,
        value: "test@test.test",
      },
    ],
  };
  return <Logins sortedIdentities={mockedSortedResponse} />;
};
