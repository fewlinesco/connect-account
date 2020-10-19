import React from "react";
import styled from "styled-components";

import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";
import { Separator } from "../Separator/Separator";

export const Languages: React.FC = () => {
  return (
    <div>
      <H1>Switch Language</H1>
      <Input />
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
    </div>
  );
};

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
