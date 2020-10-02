import React from "react";
import styled from "styled-components";

import { Input } from "./Input";

export default { title: "components/Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return (
    <Container>
      <Input placeholder="input placeholder" />
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  input {
    width: 100%;
  }
`;
