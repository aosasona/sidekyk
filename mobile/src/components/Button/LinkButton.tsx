import Button, { ButtonProps } from "./Button";
import * as Haptics from "expo-haptics";
import { GestureResponderEvent } from "react-native";

export default function LinkButton({ children, ...props }: ButtonProps) {
	props = {
		...props,
		width: "auto",
		backgroundColor: "transparent",
		color: props.color ?? (props.disabled ? "alt.400" : "primary"),
		padding: 0,
		margin: 0,
	};

	async function overridenPressCallback(e: GestureResponderEvent) {
		if (props.enableHaptics) {
			await Haptics.impactAsync();
		}
		if (props.onPress) {
			props?.onPress(e);
		}
	}
	return (
		<Button {...props} onPress={overridenPressCallback}>
			{children}
		</Button>
	);
}
