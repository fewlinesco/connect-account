import React from "react";
import styled from "styled-components";

export const NavigationBreadcrumbs: React.FC = () => {
  return (
    <Wrapper>
      <h2>Logins</h2>
      <p>Your emails, phones and social logins</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.component.s} 0;

  p {
    font-weight: ${({ theme }) => theme.fontWeights.light};
  }
`;
