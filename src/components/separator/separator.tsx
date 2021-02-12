import style from "styled-components";

const Separator = style.div`
    border: 1px solid ${({ theme }) => theme.colors.separator};
    cursor: default;
`;

export { Separator };
