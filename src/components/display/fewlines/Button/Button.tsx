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
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  font-size: ${({ theme }) => theme.fontSizes.s};
  cursor: pointer;
  width: 100%;

  ${(props) =>
    props.variant === ButtonVariant.PRIMARY &&
    `
      background: ${props.theme.colors.primary};
      color: ${props.theme.colors.background};
    `};

  ${(props) =>
    props.variant === ButtonVariant.SECONDARY &&
    `
      background: ${props.theme.colors.background};
      border: 0.1rem solid ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};

    `};

  ${(props) =>
    props.variant === ButtonVariant.DANGER &&
    `
      background: ${props.theme.colors.red};
      color: ${props.theme.colors.background};
      
    `};

  ${(props) =>
    props.variant === ButtonVariant.GHOST &&
    `
      background: ${props.theme.colors.background};
      color: ${props.theme.colors.red};

    `};
`;
