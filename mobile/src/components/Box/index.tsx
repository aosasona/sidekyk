import { ThemeProps } from "@sidekyk/lib/types/theme";
import styled, { DefaultTheme } from "styled-components/native";
import { View } from "react-native";
import { border, BorderProps, color, ColorProps, flexbox, FlexboxProps, layout, LayoutProps, position, PositionProps, space, SpaceProps } from "styled-system";
import { ComponentPropsWithoutRef } from "react";
import { StyledComponent } from "styled-components";

export type BoxProps = LayoutProps &
	ColorProps &
	FlexboxProps &
	BorderProps &
	PositionProps &
	SpaceProps &
	ComponentPropsWithoutRef<typeof View> &
	ThemeProps & {
		transparent?: boolean;
		nobg?: boolean;
	};

const StyledBox = styled.View<BoxProps>`
	${layout}
	${color}
${flexbox}
${border}
${position}
${space}
` as StyledComponent<typeof View, DefaultTheme, BoxProps, never>;

function Box({ children, ...props }: BoxProps) {
	return (
		<StyledBox {...props} backgroundColor={props.transparent || props.nobg ? "transparent" : props.bg ?? props.backgroundColor ?? "transparent"}>
			{children}
		</StyledBox>
	);
}

export default Box;
