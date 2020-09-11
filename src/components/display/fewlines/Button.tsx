import styled from "styled-components";

export enum ButtonVariant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  DANGER = "DANGER",
  GHOST = "GHOST",
}

interface ButtonProps {
  variant?: ButtonVariant;
}

export const Button = styled.button<ButtonProps>`
  width: 46.4rem;
  height: 4rem;
  border-radius: 0.2rem;
  font-size: ${({ theme }) => theme.fontSizes.s};
  ${(props) =>
    props.variant === ButtonVariant.PRIMARY &&
    `
      background: ${props.theme.colors.primary};
      color: ${props.theme.colors.backgroundContrast};
    `};

  ${(props) =>
    props.variant === ButtonVariant.SECONDARY &&
    `
      background: ${props.theme.colors.backgroundContrast};
      border: 0.1rem solid ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};

    `};

  ${(props) =>
    props.variant === ButtonVariant.DANGER &&
    `
      background: ${props.theme.colors.red};
      color: ${props.theme.colors.backgroundContrast};
      
    `};

  ${(props) =>
    props.variant === ButtonVariant.GHOST &&
    `
      background: ${props.theme.colors.backgroundContrast};
      color: ${props.theme.colors.red};

    `};
`;
