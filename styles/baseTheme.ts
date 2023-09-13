/** @format */

import { theme as baseTheme, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
  cssVarPrefix: "mainstack",
};

export const theme = extendTheme({
  config,
  colors: {
    "primary-white-3": "#fff",
    "light-blue": "#0074D9",
    "dark-blue": "#003D72",
    "grey-1": "#93A3B1",
    "bg-grey": "#F8FAFB",
  },
  fonts: {
    heading: `Degular Display, ${baseTheme.fonts?.heading}`,
    body: `Degular, ${baseTheme.fonts?.body}`,
  },
  fontSizes: {
    p: "16px",
  },
  breakpoints: {
    ...baseTheme.breakpoints,
    xxl: "1440px",
  },
  shadows: {
    paginator_shadow: "0px 7px 16px rgba(0, 0, 0, 0.14);",
    toaster_shadow: "0px 8px 16px 4px rgba(188, 196, 204, 0.12);",
  },
});