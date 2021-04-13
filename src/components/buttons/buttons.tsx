import { useButton } from "@react-aria/button";
import React from "react";
import styled from "styled-components";

import { Triangle } from "../icons/triangle/triangle";
import { deviceBreakpoints } from "@src/design-system/theme";

enum ButtonVariant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  LIGHT_GREY = "LIGHT_GREY",
  DANGER = "DANGER",
  GHOST = "GHOST",
}

type ButtonProps = {
  type: "button" | "submit" | "reset";
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  variant?: ButtonVariant;
};

const Button: React.FC<ButtonProps> = (props) => {
  const { variant, children } = props;
  const buttonRef = React.useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

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

  ${({ theme, variant }) =>
    variant === ButtonVariant.PRIMARY &&
    `
      background: ${theme.colors.primary};
      color: ${theme.colors.background};
    `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.SECONDARY &&
    `
      background: ${theme.colors.background};
      border: 0.1rem solid ${theme.colors.primary};
      color: ${theme.colors.primary};
      
      &:hover {
        background: ${theme.colors.background};
      }
      `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.LIGHT_GREY &&
    `
    color: ${theme.colors.black};
    background: #F0F1F3;
    font-size: ${theme.fontSizes.paragraph};

      &:hover {
        background: #F0F1F3;
      }

      @media ${deviceBreakpoints.m} {
      margin-bottom: 0;
      padding: 3rem 4rem;
      width: 100%;
      background: ${theme.colors.background};
      border-top: ${theme.colors.blacks[0]} ${theme.borders.thin};
  }
    `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.DANGER &&
    `
      background: ${theme.colors.red};
      color: ${theme.colors.background};
      
      &:hover {
        background: ${theme.colors.red};
      }

    `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.GHOST &&
    `
      background: ${theme.colors.background};
      color: ${theme.colors.red};

      &:hover {
        background: ${theme.colors.background};
      }
    `};
`;

const ShowMoreButton: React.FC<{
  hideList: boolean;
  quantity: number;
  setHideList: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const { hideList, quantity, setHideList } = props;
  const showMoreButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    showMoreButtonRef,
  );

  return (
    <ShowMoreButtonStyle
      {...buttonProps}
      onClick={() => setHideList(!hideList)}
    >
      {hideList ? (
        <div>
          Show {quantity} more <Triangle rotate={hideList} />
        </div>
      ) : (
        <div>
          Hide {quantity} <Triangle rotate={hideList} />
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
  padding: 0 2rem;
  cursor: pointer;
`;

export { Button, StyledButton, ButtonVariant, ShowMoreButton };
