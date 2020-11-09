import React from "react";
import styled from "styled-components";

import { TimelineBulletPoint } from "../Icons/TimelineBulletPoint/TimelineBulletPoint";

export const Timeline: React.FC = () => {
  return (
    <Flex>
      <BulletPointContainer>
        <TimelineBulletPoint />
      </BulletPointContainer>
      <LineContainer>
        <Line />
      </LineContainer>
    </Flex>
  );
};

const Flex = styled.div`
  position: absolute;
  left: -1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 0.8rem;
`;

const BulletPointContainer = styled.div`
  width: 0.8rem;
  margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
`;

const LineContainer = styled.div`
  width: 0.8rem;
  margin: 0 0 0 0.4rem;
  height: 100%;
`;

const Line = styled.div`
  height: calc(95% + ${({ theme }) => theme.spaces.s});
  border-left: 1px solid ${({ theme }) => theme.colors.separator};
`;
