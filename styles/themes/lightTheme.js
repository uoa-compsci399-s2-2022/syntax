import { createTheme } from "@nextui-org/react";

const lightTheme = createTheme({
	type: "light",
	theme: {
		colors: {
			text: "#37352F",
			textSecondary: "#666666",
			textDisabled: "#C7C7C7",
			selection: "#3297FD"
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

export default lightTheme;
