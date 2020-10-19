import React from "react";
import styled from "styled-components";

import { ShowIdentity } from "./ShowIdentity";
import { Identity, IdentityTypes } from "@lib/@types";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

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
    <Wrapper>
      <ShowIdentity identity={mockedResponse} />
    </Wrapper>
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
    <Wrapper>
      <ShowIdentity identity={mockedResponse} />
    </Wrapper>
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
    <Wrapper>
      <ShowIdentity identity={mockedResponse} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;
