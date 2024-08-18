import Text from "../Text/Text";
import Box from "../Box";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@sidekyk/hooks/useTheme";
import { StyleSheet, Switch } from "react-native";
import { Fragment, memo, ReactNode } from "react";
import CustomPressable from "../CustomPressable";
import { ThemeColor } from "@sidekyk/lib/types/theme";

type Props = {
	type?: "pressable" | "toggle";
	value?: boolean;
	title: string;
	single?: boolean;
	showBg?: boolean;
	showBorder?: boolean;
	showIcon?: boolean;
	action?: (...args: any) => void;
	disabled?: boolean;
	icon?: {
		name: keyof typeof Ionicons.glyphMap;
		bg: ThemeColor;
	};
};

function SettingsItem({ single = true, type = "pressable", showBg = true, showBorder = true, showIcon = true, ...props }: Props) {
	const { theme } = useTheme();

	const bg = single ? "alt.100" : "transparent";
	const bw = !single && showBorder ? 0.6 : 0;
	const bc = !single ? `${theme.colors.alt[200]}8A` : 0;

	return (
		<Wrapper type={type} action={props.action} disabled={props.disabled}>
			<Box bg={showBg ? bg : "transparent"} flexDirection="row" alignItems="center" pl={12} borderRadius={10} opacity={props.disabled ? 0.25 : 1}>
				{props.icon && showIcon ? (
					<Box bg={props.icon.bg} p={6} borderRadius={8} mr={12}>
						<Ionicons name={props.icon.name} size={18} color="white" />
					</Box>
				) : null}
				<Box
					flexDirection="row"
					height="100%"
					bg="transparent"
					flexGrow={1}
					justifyContent="space-between"
					alignItems="center"
					borderBottomWidth={bw}
					borderBottomColor={bc}
					pr={12}
					py={single ? (type == "toggle" ? 8 : showIcon ? 10 : 12) : 10}>
					<Box maxWidth="75%" nobg>
						<Text color="alt.900" fontWeight={400}>
							{props.title}
						</Text>
					</Box>
					<Box nobg>
						{type == "pressable" ? (
							<Ionicons name="ios-chevron-forward-outline" size={22} color={`${theme.colors.alt[300]}ba`} />
						) : (
							<Switch value={props.value} onValueChange={props.action} disabled={props.disabled} trackColor={{ true: theme.colors.primary }} thumbColor="white" />
						)}
					</Box>
				</Box>
			</Box>
		</Wrapper>
	);
}

type WrapperProps = {
	children: ReactNode;
	type: Props["type"];
	action: Props["action"];
	disabled: Props["disabled"];
};

function Wrapper({ children, type, action, disabled }: WrapperProps) {
	if (type == "pressable") {
		return (
			<CustomPressable onPress={action} disabled={disabled}>
				{children}
			</CustomPressable>
		);
	}

	return <Fragment>{children}</Fragment>;
}

export default memo(SettingsItem);
