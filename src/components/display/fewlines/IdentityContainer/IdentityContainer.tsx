import style from "styled-components";

export const IdentityContainer = style.div`
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.radii[0]};
    box-shadow: ${({ theme }) => theme.shadows.box};
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
`;
