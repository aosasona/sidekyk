import dark from "./dark";
import light from "./light";
import { default as otherColors } from "./colors";

// export const PRIMARY_COLOR = "#0066FE";
export const PRIMARY_COLOR = "#EF4343";

const space = {
	container: 20,
	xs: 2,
	sm: 4,
	base: 8,
	md: 12,
	lg: 16,
	xl: 32,
	"2xl": 64,
	"3xl": 128,
	"4xl": 256,
	"5xl": 512,
};

const fontSizes = {
	xs: 10,
	sm: 13,
	base: 16,
	md: 18,
	lg: 20,
	xl: 24,
	"2xl": 28,
	"3xl": 32,
	"4xl": 44,
	"5xl": 52,
	"6xl": 64,
	"7xl": 72,
	"8xl": 84,
	"9xl": 92,
};

const fontWeight = {
	thin: 100,
	extralight: 200,
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
};

export const theme = {
	space,
	fontSizes,
	fontWeight,
};

export default function getTheme(theme: "dark" | "light", accentColor = PRIMARY_COLOR) {
	const colors = theme == "light" ? light : dark;
	const themeColors = Object.assign(colors, otherColors);
	return {
		colors: {
			primary: accentColor,
			primaryFaded: `${accentColor}1D`,
			brandWhite: "#fefefe",
			...themeColors,
		},
		space,
		fontWeight,
		fontSizes,
		fonts: ["Inter"],
	} as const;
}
