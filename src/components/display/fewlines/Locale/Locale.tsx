import React from "react";
import styled from "styled-components";

import { H1 } from "../H1/H1";
import { MagnifyingGlass } from "../Icons/MagnifyingGlas/MagnifyingGlass";
import { Input } from "../Input/Input";
import { RadioButton } from "../RadioButton/RadioButton";
import { Separator } from "../Separator/Separator";
import { deviceBreakpoints } from "@src/design-system/theme";

export const Locale: React.FC = () => {
  return (
    <>
      <Container>
        <H1>Switch Language</H1>
        <div className="search-input">
          <Input />
          <div className="magnifying-glass">
            <MagnifyingGlass />
          </div>
        </div>
      </Container>
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

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 100%;
  }

  .search-input {
    display: flex;
    position: relative;
    margin-top: ${({ theme }) => theme.spaces.s};
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

export const ListItem = styled.div`
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
