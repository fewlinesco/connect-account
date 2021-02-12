import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { IdentityOverview } from "./identity-overview";

const PrimaryIdentityOverview = (): JSX.Element => {
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

const NonPrimaryIdentityOverview = (): JSX.Element => {
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

const NonValidatedIdentityOverview = (): JSX.Element => {
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

export {
  PrimaryIdentityOverview,
  NonPrimaryIdentityOverview,
  NonValidatedIdentityOverview,
};
export default {
  title: "pages/Identity Overview",
  component: IdentityOverview,
};
