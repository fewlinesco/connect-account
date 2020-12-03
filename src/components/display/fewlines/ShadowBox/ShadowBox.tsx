import style from "styled-components";

export const ShadowBox = style.div`
    background: ${({ theme }) => theme.colors.shadowBox};
    border-radius: ${({ theme }) => theme.radii[0]};
    box-shadow: ${({ theme }) => theme.shadows.box};
    margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
`;
