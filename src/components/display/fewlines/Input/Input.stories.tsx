import React from "react";

import { Container } from "../Container";
import { Input } from "./Input";

export default { title: "components/Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return (
    <Container>
      <Input placeholder="input placeholder" />
    </Container>
  );
};
