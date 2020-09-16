import style from "styled-components";

export const BoxedLink = style.div`
background: ${({ theme }) => theme.colors.backgroundContrast};
    height: 7.2rem;
    border-radius: ${({ theme }) => theme.radii[0]};
    display: table-cell;
    vertical-align: middle;
`;
