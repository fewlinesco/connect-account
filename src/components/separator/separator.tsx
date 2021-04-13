import style from "styled-components";

const Separator = style.div`
    border: 0.1rem solid ${({ theme }) => theme.colors.separator};
    cursor: default;
`;

export { Separator };
