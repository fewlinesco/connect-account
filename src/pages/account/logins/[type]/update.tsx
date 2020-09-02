import React from "react";
import styled from "styled-components";

import { Identity } from "../../../../../src/@types/Identity";
import { UpdateInput } from "../../../../../src/components/UpdateInput";

const UpdateIdentity: React.FC<{ identity: Identity }> = ({ identity }) => {
  const { value } = identity;
  return (
    <>
      <IdentityBox key={value}>
        <Flex>
          <Value>{value}</Value>
        </Flex>
      </IdentityBox>
      <UpdateInput currentIdentity={identity} />
    </>
  );
};

export default UpdateIdentity;

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

const Value = styled.p`
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
