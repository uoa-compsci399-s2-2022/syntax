import { createTheme } from "@nextui-org/react";

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      accents0: "#1D1D1D",
      accents1: "#202020",
      accents2: "#222222",
      accents3: "#252525",
      accents4: "#272727",
      accents5: "#383838",
      accents6: "#454545",
      accents7: "#525252",
      accents8: "#5E5E5E",
      accents9: "#6B6B6B",
      background: "#121212",
      backgroundContrast: "#1D1D1D",
      textSecondary: "#A4A4A4"
    },
    radii: {
      xs: "1px",
      sm: "3px",
      md: "7px",
      base: "8px",
      lg: "8px",
      xl: "12px",
      "2xl": "18px",
      "3xl": "26px"
    }
  }
});

export default darkTheme;
