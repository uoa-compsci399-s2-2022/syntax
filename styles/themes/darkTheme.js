import { createTheme } from "@nextui-org/react";

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      neutralLight: "#272727",
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
      xs: "3px",
      sm: "5px",
      md: "9px",
      base: "10px",
      lg: "10px",
      xl: "14px",
      "2xl": "20px",
      "3xl": "28px"
    }
  }
});

export default darkTheme;
