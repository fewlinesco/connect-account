import style from "styled-components";

export const BoxedLink = style.div`
    background: ${({ theme }) => theme.colors.backgroundContrast};
    height: 7.2rem;
    vertical-align: middle;
    width: 90%;
    margin: 0 auto;
`;
