import { ComponentPropsWithoutRef } from "react";
import { ScrollView as NativeScrollView } from "react-native";
import { StyledComponent } from "styled-components";
import styled, { DefaultTheme } from "styled-components/native";
import { color, ColorProps, flexbox, FlexboxProps, layout, LayoutProps, space, SpaceProps } from "styled-system";

type ScrollViewProps = LayoutProps & ColorProps & SpaceProps & FlexboxProps & ComponentPropsWithoutRef<typeof NativeScrollView>;

const StyledScrollView = styled.ScrollView`
	${color}
	${layout}
${flexbox}
${space}
` as StyledComponent<typeof NativeScrollView, DefaultTheme, ScrollViewProps, never>;

StyledScrollView.defaultProps = {
	backgroundColor: "transparent",
};

export default function ScrollView({ children, ...props }: ScrollViewProps) {
	return (
		<StyledScrollView
			{...props}
			showsVerticalScrollIndicator={props?.showsVerticalScrollIndicator ?? false}
			showsHorizontalScrollIndicator={props?.showsHorizontalScrollIndicator ?? false}>
			{children}
		</StyledScrollView>
	);
}
