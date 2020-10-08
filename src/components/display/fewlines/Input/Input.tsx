import styled from "styled-components";

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
  border-radius: ${({ theme }) => theme.radii[0]};
  height: 4rem;
  padding-left: 1.6rem;
  width: 100%;
  margin: ${({ theme }) => theme.spaces.xxs} 0 ${({ theme }) => theme.spaces.xs};

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;
