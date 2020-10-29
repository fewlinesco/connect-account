import { DefaultTheme } from "styled-components";

import {
  decatTheme,
  deviceBreakpoints as decatDeviceBreakpoints,
} from "./decatTheme";
import {
  lightTheme,
  deviceBreakpoints as fewlinesDeviceBreakpoints,
  DeviceBreakpoints,
} from "./lightTheme";
import { config } from "@src/config";

let theme: DefaultTheme;
let deviceBreakpoints: DeviceBreakpoints;

if (config.connectTheme === "fewlines") {
  deviceBreakpoints = fewlinesDeviceBreakpoints;
  theme = lightTheme;
} else {
  theme = decatTheme;
  deviceBreakpoints = decatDeviceBreakpoints;
}

export { theme, deviceBreakpoints };
