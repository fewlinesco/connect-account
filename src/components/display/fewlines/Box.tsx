import style from "styled-components";

export const Box = style.div`
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spaces.component.xxs} ${({ theme }) =>
  theme.spaces.component.xxs};
`;
