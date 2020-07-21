import { useContext } from "react";
import { ThemeContext } from "styled-components";

import { LightTheme } from "./lightTheme";

export function useTheme(): LightTheme {
  const theme = useContext(ThemeContext);
  return theme || {};
}
