import styled from "styled-components";

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
  border-radius: ${({ theme }) => theme.radii[0]};
  height: 4rem;
  padding-left: 1.6rem;

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;
