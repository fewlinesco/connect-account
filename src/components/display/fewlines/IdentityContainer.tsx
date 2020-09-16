import style from "styled-components";

export const IdentityContainer = style.div`
background: ${({ theme }) => theme.colors.backgroundContrast};
    border-radius: ${({ theme }) => theme.radii[0]};
    box-shadow: 0px 0px 16px rgba(24, 37, 170, 0.08);
`;
