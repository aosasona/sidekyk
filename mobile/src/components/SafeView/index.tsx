import useTheme from "@sidekyk/hooks/useTheme";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import React, { useMemo } from "react";
import { KeyboardAvoidingView } from "react-native";
import SafeAreaView, { ForceInsetProp } from "react-native-safe-area-view";

interface SafeViewProps {
	children: React.ReactNode;
	forceInset?: ForceInsetProp;
	avoidKeyboard?: boolean;
	isModal?: boolean;
	transparent?: boolean;
}

export default function SafeView({ children, avoidKeyboard, ...props }: SafeViewProps) {
	const behaviour = IS_ANDROID ? "height" : "padding";

	if (avoidKeyboard) {
		return (
			<Wrapper {...props}>
				<KeyboardAvoidingView behavior={behaviour} style={{ backgroundColor: "transparent", flex: 1 }}>
					{children}
				</KeyboardAvoidingView>
			</Wrapper>
		);
	}

	return <Wrapper {...props}>{children}</Wrapper>;
}

function Wrapper({ children, isModal, transparent, forceInset = { top: "always" } }: SafeViewProps & {}) {
	const { theme } = useTheme();
	const insets: ForceInsetProp = useMemo(() => (isModal ? { vertical: "never" } : forceInset), [isModal]);
	return (
		<SafeAreaView forceInset={insets} style={{ flex: 1, backgroundColor: !transparent ? (isModal ? theme.colors.modal : theme.colors.bg) : "transparent" }}>
			{children}
		</SafeAreaView>
	);
}

export function KeyboardAvoidingViewWrapper({ children }: { children: React.ReactNode }) {
	const behaviour = IS_ANDROID ? "height" : "padding";
	return (
		<KeyboardAvoidingView behavior={behaviour} style={{ backgroundColor: "transparent", flex: 1, flexGrow: 1 }}>
			{children}
		</KeyboardAvoidingView>
	);
}
