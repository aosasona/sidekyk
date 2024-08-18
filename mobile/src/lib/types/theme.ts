import getTheme, { theme } from "@sidekyk/theme";

export type AppTheme = "dark" | "light";
export type ThemeType = ReturnType<typeof getTheme>;
export type PropsWithTheme<T = {}> = {
	theme: ThemeType;
} & T;

export type Spacing = keyof typeof theme.space | number;

export type ThemeColorsKey = keyof ThemeType["colors"];
export type ColorShades = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;
export type Hex = `#${string}`;
type DefaultColors = "transparent" | "current" | "black" | "white" | "gray" | "red" | "yellow" | "green" | "blue" | "indigo" | "purple" | "pink";
export type CustomThemeColor = RGBA | HSLA | Hex;
export type ThemeColor = `${ThemeColorsKey}.${ColorShades}` | ThemeColorsKey | CustomThemeColor | DefaultColors;

export type ThemeProps = {
	fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "bold" | "normal";
	fontSize?: keyof typeof theme.fontSizes | number;
	color?: ThemeColor;
	bg?: ThemeColor;
	backgroundColor?: ThemeColor;
	borderColor?: ThemeColor;
	m?: Spacing;
	mx?: Spacing;
	my?: Spacing;
	mt?: Spacing;
	mb?: Spacing;
	margin?: Spacing;
	marginX?: Spacing;
	marginY?: Spacing;
	p?: Spacing;
	px?: Spacing;
	py?: Spacing;
	pt?: Spacing;
	pb?: Spacing;
	padding?: Spacing;
	paddingX?: Spacing;
	paddingY?: Spacing;
};
