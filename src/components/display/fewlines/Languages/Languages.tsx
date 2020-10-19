import React from "react";
import styled from "styled-components";

import { H1 } from "../H1/H1";
import { MagnifyingGlass } from "../Icons/MagnifyingGlas/MagnifyingGlass";
import { Separator } from "../Separator/Separator";

export const Languages: React.FC = () => {
  return (
    <Container>
      <H1>Switch Language</H1>
      <div className="search-input">
        <input />
        <div className="magnifying-glass">
          <MagnifyingGlass />
        </div>
      </div>
      <Wrapper>
        <div className="list-item">
          <div>English</div>
          <label className="radio-container">
            <input type="radio" name="language" value="english" />
            <span className="circle"></span>
          </label>
        </div>
        <Separator />
        <div className="list-item">
          <div>French</div>
          <label className="radio-container">
            <input type="radio" name="language" value="french" />
            <span className="circle"></span>
          </label>
        </div>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  .search-input {
    display: flex;
    align-items: center;
    border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
    border-radius: ${({ theme }) => theme.radii[0]};
  }

  input {
    width: 100%;
    display: block;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .list-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 10px 0;
  }

  .radio-container {
    display: inline-block;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding-left: 30px;
  }

  .radio-container input {
    display: none;
  }

  .radio-container .circle {
    display: inline-block;
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
    border: 2px solid #1825aa;
  }

  .radio-container input:checked + .circle:after {
    content: "";
    height: 10px;
    width: 10px;
    background-color: #1825aa;
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
