import React from "react";
import styled from "styled-components";

const Triangle: React.FC<{ rotate: boolean }> = ({ rotate }) => {
  const className = rotate ? "rotate" : "";

  return (
    <Rotate>
      <svg
        width="11"
        height="5"
        viewBox="0 0 11 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M10.5 5L5.50003 5.96244e-08L0.500031 5L10.5 5Z"
          fill="#03083C"
        />
      </svg>
    </Rotate>
  );
};

const Rotate = styled.span`
  svg {
    margin-bottom: 0.3rem;
  }

  .rotate {
    transform: rotate(180deg);
    margin-bottom: 0.3rem;
  }
`;

export { Triangle };
