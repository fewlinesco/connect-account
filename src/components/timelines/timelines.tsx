import React from "react";
import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

const Timeline: React.FC = () => {
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

const TimelineEnd: React.FC = () => {
  return (
    <Flex>
      <BulletPointContainer>
        <TimelineBulletPoint />
      </BulletPointContainer>
      <LineContainer>
        <EndLine />
      </LineContainer>
      <GhostBulletPointContainer>
        <GhostTimelineBulletPoint />
      </GhostBulletPointContainer>
    </Flex>
  );
};

const TimelineBulletPoint: React.FC = () => {
  return (
    <svg width="8" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill="#F0F1F3" />
    </svg>
  );
};

const GhostTimelineBulletPoint: React.FC = () => {
  return (
    <svg width="8" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3.5" fill="#fff" stroke="#F0F1F3" />
    </svg>
  );
};

const Flex = styled.div`
  position: absolute;
  left: -1.5rem;
  display: none;
  flex-direction: column;
  height: 100%;
  width: 0.8rem;

  @media ${deviceBreakpoints.m} {
    display: flex;
  }
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
  height: calc(100% - 0.6rem);
  border-left: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;

const GhostBulletPointContainer = styled.div`
  width: 0.8rem;
  margin: -1rem 0 -0.2rem 0;
`;

const EndLine = styled.div`
  height: 100%;
  border-left: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;

export { Timeline, TimelineEnd, TimelineBulletPoint };
