import style from "styled-components";

export const Separator = style.div`
    border: 1px solid ${({ theme }) => theme.colors.separator};
    cursor: default;
`;
