import { ComponentPropsWithoutRef } from "react";
import { GestureResponderEvent, Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";

type Props = ComponentPropsWithoutRef<typeof Pressable> & {
	enableHaptics?: boolean;
	retainOpacity?: boolean;
};
export default function CustomPressable({ children, ...props }: Props) {
	function overridenPressCallback(e: GestureResponderEvent) {
		if (props.enableHaptics && !props.disabled) Haptics.impactAsync().then().catch();
		if (props.onPress) props?.onPress(e);
	}

	function styles(event: PressableStateCallbackType): StyleProp<ViewStyle> {
		const propsStyle = typeof props?.style == "object" ? props?.style : {};
		return {
			...propsStyle,
			opacity: event.pressed && !props?.retainOpacity && !props.disabled ? 0.5 : 1,
		};
	}

	return (
		<Pressable {...props} onPress={overridenPressCallback} style={styles}>
			{children}
		</Pressable>
	);
}
