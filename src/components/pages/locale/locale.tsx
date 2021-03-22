import React from "react";
import styled from "styled-components";

import { MagnifyingGlass } from "@src/components/icons/magnifying-glass/magnifying-glass";
import { InputRadio } from "@src/components/input/input-radio-button";
import { InputText } from "@src/components/input/input-text";
import { deviceBreakpoints } from "@src/design-system/theme";

const Locale: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <>
      <SearchInputContainer>
        <InputText
          type="text"
          name="search"
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value);
          }}
          label=""
          aria-label="Search language"
        />
        <div className="magnifying-glass">
          <MagnifyingGlass />
        </div>
      </SearchInputContainer>

      <LanguagesList>
        <InputRadio
          inputsData={[
            {
              name: "language",
              value: "English",
              onChange: () => {
                return;
              },
            },
            {
              name: "language",
              value: "Français",
              onChange: () => {
                return;
              },
            },
          ]}
        />
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

export { Locale, ListItem };
