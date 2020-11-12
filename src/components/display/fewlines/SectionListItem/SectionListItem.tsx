import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { NeutralLink } from "../NeutralLink";
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
      <Link href={`/account/${sectionName.toLocaleLowerCase()}`} passHref>
        <Flex>
          {icon}
          <TextBox>
            <SectionName>{sectionName}</SectionName>
            {text}
          </TextBox>
          <RightChevron />
        </Flex>
      </Link>
    </ShadowBox>
  );
};

const Flex = styled(NeutralLink)`
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
