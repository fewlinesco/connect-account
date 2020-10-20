import React from "react";
import styled from "styled-components";

import { H1 } from "../H1/H1";
import { MagnifyingGlass } from "../Icons/MagnifyingGlas/MagnifyingGlass";
import { Input } from "../Input/Input";
import { Separator } from "../Separator/Separator";

export const Languages: React.FC = () => {
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
          <label className="radio-container">
            <input type="radio" name="language" checked={true} />
            <span className="circle"></span>
          </label>
        </ListItem>
        <Separator />
      </LanguagesList>
    </>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  .search-input {
    display: flex;
    position: relative;
    margin-top: ${({ theme }) => theme.spaces.m};
    margin-bottom: ${({ theme }) => theme.spaces.s};
  }

  .magnifying-glass {
    position: absolute;
    right: 15px;
    bottom: 27px;
    cursor: pointer;
  }
`;

const LanguagesList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .radio-container {
    position: relative;
    top: -10px;
    cursor: pointer;
    user-select: none;
    padding-left: 30px;
  }

  .radio-container input {
    display: none;
  }

  .radio-container .circle {
    width: 20px;
    height: 20px;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    border: 2px solid black;
  }

  .radio-container input:checked + .circle {
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  .radio-container input:checked + .circle:after {
    content: "";
    height: 10px;
    width: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  height: 4.8rem;
`;

const Value = styled.div`
  margin-left: ${({ theme }) => theme.spaces.xxs};
`;
