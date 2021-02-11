import styled from "styled-components";

const Input = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
  border-radius: ${({ theme }) => theme.radii[0]};
  height: 4rem;
  padding-left: 1.6rem;
  width: 100%;
  margin: ${({ theme }) => theme.spaces.xxs} 0 ${({ theme }) => theme.spaces.xs};

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGrey};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }

  &[type="checkbox"] {
    width: 18px;
    height: 1.6rem;
    margin: 0 ${({ theme }) => theme.spaces.xxs} 0 0;
    cursor: pointer;
  }
`;

export { Input };
