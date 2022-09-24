import { createTheme } from "@nextui-org/react";

const lightTheme = createTheme({
    type: "light",
    theme: {
      colors: {
        text: "#37352F",
        textSecondary: "#666666",
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
  })

  export default lightTheme;