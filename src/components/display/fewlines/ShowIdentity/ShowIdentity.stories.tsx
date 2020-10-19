import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { ShowIdentity } from "./ShowIdentity";
import { Identity, IdentityTypes } from "@lib/@types";

export default { title: "pages/ShowIdentity", component: ShowIdentity };

export const ShowPrimaryIdentity = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: true,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <ShowIdentity identity={mockedResponse} />
    </StoriesContainer>
  );
};

export const ShowNonPrimaryIdentity = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "validated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <ShowIdentity identity={mockedResponse} />
    </StoriesContainer>
  );
};

export const ShowNonValidatedIdentity = (): JSX.Element => {
  const mockedResponse: Identity = {
    id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
    primary: false,
    status: "unvalidated",
    type: IdentityTypes.EMAIL,
    value: "test@test.test",
  };

  return (
    <StoriesContainer>
      <ShowIdentity identity={mockedResponse} />
    </StoriesContainer>
  );
};
