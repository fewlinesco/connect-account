import React from "react";
import styled from "styled-components";

import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";

export const Languages: React.FC = () => {
  return (
    <div>
      <H1>Switch Language</H1>
      <Input />
      <Wrapper>
        <label className="radio-container">
          English
          <input type="radio" name="language" value="english" />
          <span className="circle"></span>
        </label>
        <label className="radio-container">
          French
          <input type="radio" name="language" value="french" />
          <span className="circle"></span>
        </label>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
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
    width: 25px;
    height: 25px;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    border: 3px solid black;
  }

  .radio-container input:checked + .circle {
    border: 3px solid #1825aa;
  }

  .radio-container input:checked + .circle:after {
    content: "";
    height: 11px;
    width: 11px;
    background-color: #1825aa;
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-55%, -55%);
  }
`;
