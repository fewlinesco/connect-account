import React from "react";
import styled from "styled-components";

import { RightChevron } from "../components/icons/right-chevron/right-chevron";
import { NeutralLink } from "../components/neutral-link/neutral-link";
import { SectionBox } from "../components/shadow-box/section-box";

type SectionListItemProps = {
  sectionName: string;
  content: { text: string; icon: JSX.Element };
};

export const SectionListItem: React.FC<SectionListItemProps> = ({
  sectionName,
  content,
}) => {
  const { text, icon } = content;

  return (
    <SectionBox>
      <SectionLink href={`/account/${sectionName.toLocaleLowerCase()}`}>
        {icon}
        <TextBox>
          <SectionName>{sectionName}</SectionName>
          {text}
        </TextBox>
        <RightChevron />
      </SectionLink>
    </SectionBox>
  );
};

const SectionLink = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
`;

export const TextBox = styled.div`
  max-width: 50%;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.title};
`;

export const SectionName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
