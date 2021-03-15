import { useButton } from "@react-aria/button";
import React from "react";
import styled from "styled-components";

import { Triangle } from "../icons/triangle/triangle";

enum ButtonVariant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  DANGER = "DANGER",
  GHOST = "GHOST",
}

interface ButtonProps {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { variant, children } = props;
  const buttonRef = React.useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

  console.log(buttonProps);

  return (
    <StyledButton {...buttonProps} variant={variant}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<Record<string, unknown>>`
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  font-size: ${({ theme }) => theme.fontSizes.s};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spaces.xxs};
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

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

      &:hover {
        background: ${props.theme.colors.background};
      }
    `};

  ${(props) =>
    props.variant === ButtonVariant.DANGER &&
    `
      background: ${props.theme.colors.red};
      color: ${props.theme.colors.background};
      
      &:hover {
        background: ${props.theme.colors.red};
      }

    `};

  ${(props) =>
    props.variant === ButtonVariant.GHOST &&
    `
      background: ${props.theme.colors.background};
      color: ${props.theme.colors.red};

      &:hover {
        background: ${props.theme.colors.background};
      }
    `};
`;

const ShowMoreButton: React.FC<{
  hide: boolean;
  quantity: number;
  setHideSecondary: (value: boolean) => void;
}> = (props) => {
  const { hide, quantity, setHideSecondary } = props;
  const showMoreButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    showMoreButtonRef,
  );

  return (
    <ShowMoreButtonStyle
      {...buttonProps}
      onClick={() => setHideSecondary(!hide)}
    >
      {hide ? (
        <div>
          Show {quantity} more <Triangle rotate={hide} />
        </div>
      ) : (
        <div>
          Hide {quantity} <Triangle rotate={hide} />
        </div>
      )}
    </ShowMoreButtonStyle>
  );
};

const ShowMoreButtonStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.5rem;
  margin-bottom: 2rem;
  cursor: pointer;
`;

export { Button, StyledButton, ButtonVariant, ShowMoreButton };
