import React from "react";
import styled from "styled-components";

import { TimelineBulletPoint } from "../Icons/TimelineBulletPoint/TimelineBulletPoint";

export const Timeline: React.FC = () => {
  return (
    <>
      <BulletPointContainer>
        <TimelineBulletPoint />
      </BulletPointContainer>
      <TimelineContainer>
        <Line />
      </TimelineContainer>
    </>
  );
};

const BulletPointContainer = styled.div`
  display: inline-block;
`;

const TimelineContainer = styled.div`
  display: block;
  width: 0.8rem;
  height: 100%;
  margin: 0 0 0 0.4rem;
`;

const Line = styled.div`
  height: calc(100% + ${({ theme }) => theme.spaces.s});
  border-left: 1px solid ${({ theme }) => theme.colors.separator};
`;
