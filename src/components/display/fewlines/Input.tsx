import styled from "styled-components";

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.backgroundContrast};
  border: 0.1rem solid #a1a4b1;
  border-radius: ${({ theme }) => theme.radii[0]};
  height: 4rem;

  ::placeholder {
    color: #8b90a0;
    font-size: 1.4rem;
    padding-left: 1.6rem;
  }
`;
