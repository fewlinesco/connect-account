import style from "styled-components";

const SectionBox = style.div`
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.radii[0]};
    box-shadow: ${({ theme }) => theme.shadows.box};
    margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
`;

export { SectionBox };
