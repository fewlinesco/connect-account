import { useContext } from "react";
import { ThemeContext, DefaultTheme } from "styled-components";

export function useTheme(): DefaultTheme {
  const theme = useContext(ThemeContext);
  return theme || {};
}
