import style from "styled-components";

export const Box = style.div`
    background-color: ${({ theme }) => theme.colors.box};
    padding: ${({ theme }) => theme.spaces.component.xs} ${({ theme }) =>
  theme.spaces.component.xs};
    margin: 0 0 ${({ theme }) => theme.spaces.component.xs} 0 
`;
