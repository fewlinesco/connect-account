import React from "react";
import styled from "styled-components";

import { MagnifyingGlass } from "@src/components/icons/magnifying-glass/magnifying-glass";
import { Input } from "@src/components/input/input";
import { RadioButton } from "@src/components/radio-button/radio-button";
import { Separator } from "@src/components/separator/separator";
import { deviceBreakpoints } from "@src/design-system/theme";

const Locale: React.FC = () => {
  return (
    <>
      <SearchInputContainer>
        <Input />
        <div className="magnifying-glass">
          <MagnifyingGlass />
        </div>
      </SearchInputContainer>

      <LanguagesList>
        <ListItem>
          <Value>English</Value>
          <RadioButton name="locale" checked={true} />
        </ListItem>
        <Separator />
      </LanguagesList>
    </>
  );
};

const SearchInputContainer = styled.div`
  position: relative;
  width: 90%;
  margin: ${({ theme }) => theme.spaces.s} auto 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 100%;
  }

  .magnifying-glass {
    position: absolute;
    right: 1.5rem;
    bottom: 2.8rem;
    cursor: pointer;
  }
`;

const LanguagesList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.spaces.xxs} 0;
  height: 4.8rem;
`;

const Value = styled.div`
  margin-left: ${({ theme }) => theme.spaces.xxs};
`;

export { Locale, ListItem };
