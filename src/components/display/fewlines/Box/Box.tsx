import style from "styled-components";

export const Box = style.div`
    background-color: ${({ theme }) => theme.colors.box};
    padding: ${({ theme }) => theme.spaces.xs} ${({ theme }) =>
  theme.spaces.xs};
    margin: 0 0 ${({ theme }) => theme.spaces.xs} 0 
`;
