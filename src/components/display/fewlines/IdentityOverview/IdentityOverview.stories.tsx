import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { IdentityOverview } from "./IdentityOverview";
import { Identity, IdentityTypes } from "@lib/@types";

export default { title: "pages/IdentityOverview", component: IdentityOverview };

export const PrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <IdentityOverview identity={mockedResponse} />
    </StoriesContainer>
  );
};

export const NonPrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <IdentityOverview identity={mockedResponse} />
    </StoriesContainer>
  );
};

export const NonValidatedIdentityOverview = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <IdentityOverview identity={mockedResponse} />
    </StoriesContainer>
  );
};
