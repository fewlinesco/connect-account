import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { CookieIcon } from "../icons/cookie-icon";
import { CrossIcon } from "../icons/cross-icon";
import { Triangle } from "../icons/triangle";
import { deviceBreakpoints } from "@src/design-system/theme";

enum ButtonVariant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  LIGHT_GREY = "LIGHT_GREY",
  DANGER = "DANGER",
  GHOST = "GHOST",
  PRIMARY_COOKIE = "PRIMARY_COOKIE",
  GHOST_COOKIE = "GHOST_COOKIE",
}

interface ButtonProps extends AriaButtonProps {
  type: "button" | "submit" | "reset";
  onPress?: () => void;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { variant, children } = props;
  const buttonRef = React.useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

  return (
    <StyledButton {...buttonProps} variant={variant} ref={buttonRef}>
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
  word-break: break-all;

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
  `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.LIGHT_GREY &&
    `
    color: ${theme.colors.black};
    background: #F0F1F3;
    font-size: ${theme.fontSizes.paragraph};

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
  `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.GHOST &&
    `
      background: ${theme.colors.background};
      color: ${theme.colors.red};
  `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.PRIMARY_COOKIE &&
    `
      margin-bottom: 0;
      border-radius: 0 0 ${theme.radii[0]} 0;
      background: ${theme.colors.primary};
      color: ${theme.colors.background};

      @media ${deviceBreakpoints.m} {
        height: 5rem;  
      }
  `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.GHOST_COOKIE &&
    `
    margin-bottom: 0;
    color: ${theme.colors.primary};
    background: ${theme.colors.background};
    border-radius: 0 0 0 ${theme.radii[0]};
    border-top: 0.1rem solid ${theme.colors.separator};

    @media ${deviceBreakpoints.m} {
        height: 5rem;  
    };
  `};
`;

interface ShowMoreButtonProps extends AriaButtonProps {
  hideList: boolean;
  quantity: number;
  onPress: () => void;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = (props) => {
  const { hideList, quantity } = props;
  const showMoreButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    showMoreButtonRef,
  );
  const { formatMessage } = useIntl();

  return (
    <div
      {...buttonProps}
      ref={showMoreButtonRef}
      className="flex justify-center items-center h-16 mb-8 py-8 cursor-pointer"
    >
      <p className="mr-2">{`${formatMessage({
        id: hideList ? "showMore" : "hide",
      })} (${quantity}) `}</p>
      <Triangle rotate={hideList} />
    </div>
  );
};

const CloseConfirmationBoxButton: React.FC<{ onPress: () => void }> = (
  props,
) => {
  const closeConfirmationBoxButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    closeConfirmationBoxButtonRef,
  );

  return (
    <div {...buttonProps} className="cross" ref={closeConfirmationBoxButtonRef}>
      <CrossIcon />
    </div>
  );
};

const CookieButton: React.FC<{ onPress: () => void; isOpen: boolean }> = (
  props,
) => {
  const cookieButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    cookieButtonRef,
  );

  return (
    <CookieButtonStyle {...buttonProps} ref={cookieButtonRef}>
      {props.isOpen ? <CrossIcon /> : <CookieIcon />}
    </CookieButtonStyle>
  );
};

const CookieButtonStyle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii[3]};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.box};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  :hover {
    transform: scale(1.1);
  }

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

export {
  Button,
  StyledButton,
  ButtonVariant,
  ShowMoreButton,
  CloseConfirmationBoxButton,
  CookieButton,
};
