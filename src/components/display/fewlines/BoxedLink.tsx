import style from "styled-components";

export const BoxedLink = style.div`
    height: 7.2rem;
    margin: 0 ${({ theme }) => theme.spaces.component.xs};
    display: flex;
    align-items: center;
`;
