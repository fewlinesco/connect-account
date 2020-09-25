import style from "styled-components";

export const NeutralLink = style.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};

  &:visit {
    color: ${({ theme }) => theme.colors.black};
  }

  &:hover {
    cursor: pointer;
  }
`;
