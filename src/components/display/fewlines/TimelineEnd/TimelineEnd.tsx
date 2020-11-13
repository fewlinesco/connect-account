import React from "react";
import styled from "styled-components";

import { GhostTimelineBulletPoint } from "../Icons/GhostTimelineBulletPoint/GhostTimelineBulletPoint";
import { TimelineBulletPoint } from "../Icons/TimelineBulletPoint/TimelineBulletPoint";
import { deviceBreakpoints } from "@src/design-system/theme/decatTheme";

export const TimelineEnd: React.FC = () => {
  return (
    <Flex>
      <BulletPointContainer>
        <TimelineBulletPoint />
      </BulletPointContainer>
      <LineContainer>
        <Line />
      </LineContainer>
      <GhostBulletPointContainer>
        <GhostTimelineBulletPoint />
      </GhostBulletPointContainer>
    </Flex>
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

const GhostBulletPointContainer = styled.div`
  width: 0.8rem;
  margin: 0 0 -1rem 0;
`;

const LineContainer = styled.div`
  width: 0.8rem;
  margin: 0 0 0 0.4rem;
  height: 100%;
`;

const Line = styled.div`
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.colors.separator};
`;
