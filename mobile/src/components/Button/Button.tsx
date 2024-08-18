import { ThemeProps } from "@sidekyk/lib/types/theme";
import { ComponentPropsWithoutRef } from "react";
import { GestureResponderEvent, TouchableHighlight as NativeTouchable } from "react-native";
import styled from "styled-components/native";
import { border, BorderProps, color, ColorProps, layout, LayoutProps, space, SpaceProps } from "styled-system";
import { Text } from "../Text";
import { ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";

export type ButtonProps = SpaceProps &
	BorderProps &
	ColorProps &
	LayoutProps &
	ComponentPropsWithoutRef<typeof NativeTouchable> &
	ThemeProps & {
		enableHaptics?: boolean;
		isLoading?: boolean;
	};

export const StyledButton = styled.TouchableOpacity<ButtonProps>`
	${space}
	${color}
${layout}
${border}
`;

(StyledButton.defaultProps as ButtonProps) = {
	width: "100%",
	backgroundColor: "primary",
	paddingY: 15,
	borderRadius: 9,
};

export default function Button({ children, ...props }: ButtonProps) {
	async function overridenPressCallback(e: GestureResponderEvent) {
		if (props.enableHaptics) {
			await Haptics.impactAsync();
		}
		if (props.onPress) {
			props?.onPress(e);
		}
	}

	return (
		<StyledButton {...props} opacity={props.disabled ? 0.5 : 1} onPress={overridenPressCallback}>
			{props.isLoading ? (
				<ActivityIndicator color="white" />
			) : (
				<Text color={props.color ?? "white"} fontWeight={props.fontWeight ?? 600} fontSize={props.fontSize ?? "base"} textAlign="center">
					{children}
				</Text>
			)}
		</StyledButton>
	);
}
