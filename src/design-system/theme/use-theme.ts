import { useContext } from "react";
import { ThemeContext, DefaultTheme } from "styled-components";

function useTheme(): DefaultTheme {
  const theme = useContext(ThemeContext);
  return theme || {};
}

export { useTheme };
