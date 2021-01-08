import { DefaultTheme } from "styled-components";

import {
  decatTheme,
  deviceBreakpoints as decatDeviceBreakpoints,
} from "./decat-theme";
import {
  lightTheme,
  deviceBreakpoints as fewlinesDeviceBreakpoints,
  DeviceBreakpoints,
} from "./light-theme";
import { config } from "@src/config";

let theme: DefaultTheme;
let deviceBreakpoints: DeviceBreakpoints;

if (config.connectAccountTheme === "decathlon") {
  theme = decatTheme;
  deviceBreakpoints = decatDeviceBreakpoints;
} else {
  theme = lightTheme;
  deviceBreakpoints = fewlinesDeviceBreakpoints;
}

export { theme, deviceBreakpoints };
