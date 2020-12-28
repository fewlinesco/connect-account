import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { IdentityOverview } from "./IdentityOverview";
import { Identity, IdentityTypes } from "@lib/@types";

export default {
  title: "pages/Identity Overview",
  component: IdentityOverview,
};

export const PrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: { identity: Identity; userId: string } = {
    identity: {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test@test.test",
    },
    userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
  };

  return (
    <StoriesContainer>
      <IdentityOverview
        identity={mockedResponse.identity}
        userId={mockedResponse.userId}
      />
    </StoriesContainer>
  );
};

export const NonPrimaryIdentityOverview = (): JSX.Element => {
  const mockedResponse: { identity: Identity; userId: string } = {
    identity: {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test@test.test",
    },
    userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
  };

  return (
    <StoriesContainer>
      <IdentityOverview
        identity={mockedResponse.identity}
        userId={mockedResponse.userId}
      />
    </StoriesContainer>
  );
};

export const NonValidatedIdentityOverview = (): JSX.Element => {
  const mockedResponse: { identity: Identity; userId: string } = {
    identity: {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "unvalidated",
      type: IdentityTypes.EMAIL,
      value: "test@test.test",
    },
    userId: "ac3f358d-d2c9-487e-8387-2e6866b853c9",
  };

  return (
    <StoriesContainer>
      <IdentityOverview
        identity={mockedResponse.identity}
        userId={mockedResponse.userId}
      />
    </StoriesContainer>
  );
};
