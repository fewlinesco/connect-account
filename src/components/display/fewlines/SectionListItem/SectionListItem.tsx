import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { NeutralLink } from "../NeutralLink/NeutralLink";
import { RightChevron } from "../RightChevron/RightChevron";
import { ShadowBox } from "../ShadowBox/ShadowBox";

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
    <ShadowBox>
      <Link href={`/account/${sectionName.toLocaleLowerCase()}`}>
        <NeutralLink>
          <Flex>
            {icon}
            <TextBox>
              <SectionName>{sectionName}</SectionName>
              {text}
            </TextBox>
            <RightChevron />
          </Flex>
        </NeutralLink>
      </Link>
    </ShadowBox>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;

export const TextBox = styled.div`
  max-width: 50%;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.title};
`;

export const SectionName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
