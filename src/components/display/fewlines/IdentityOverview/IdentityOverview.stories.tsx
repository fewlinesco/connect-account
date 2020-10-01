import React from "react";

import { IdentityOverview } from "./IdentityOverview";
import { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";

export default { title: "pages/IdentityOverview", component: IdentityOverview };

export const PrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return <IdentityOverview identity={mockedResponse} />;
};

export const NonPrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return <IdentityOverview identity={mockedResponse} />;
};

export const NonValidatedIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: ReceivedIdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return <IdentityOverview identity={mockedResponse} />;
};
