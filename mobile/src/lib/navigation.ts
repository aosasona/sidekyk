import { StackNavigationOptions } from "@react-navigation/stack";
import Back from "@sidekyk/components/Back";
import { ReactNode } from "react";
import { ThemeType } from "./types/theme";

export function getDefaultNavigationOptions(theme: ThemeType): StackNavigationOptions {
	return {
		headerShown: false,
		headerBackTitleVisible: true,
		headerStyle: {
			backgroundColor: theme.colors.bg,
			shadowColor: theme.colors.alt[100],
		},
		headerTitleStyle: {
			color: theme.colors.text,
		},
		headerBackTitleStyle: {
			color: theme.colors.primary,
		},
		headerTintColor: theme.colors.primary,
		headerRightContainerStyle: {
			paddingRight: 16,
		},
		headerLeftContainerStyle: {
			paddingLeft: 16,
		},
		headerLeft: Back as unknown as (props: any) => ReactNode,
	};
}
