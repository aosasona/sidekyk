import useTheme from "@sidekyk/hooks/useTheme";
import { ThemeProps } from "@sidekyk/lib/types/theme";
import { ComponentPropsWithoutRef, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { TextInput } from "react-native";
import { StyledComponent } from "styled-components";
import styled, { DefaultTheme } from "styled-components/native";
import { border, BorderProps, color, ColorProps, layout, LayoutProps, space, SpaceProps, typography, TypographyProps } from "styled-system";
import { Text } from "../Text";
import uuid from "react-native-uuid";
import { IS_ANDROID } from "@sidekyk/lib/constants";

export type InputProps = ColorProps &
	LayoutProps &
	SpaceProps &
	TypographyProps &
	BorderProps &
	ComponentPropsWithoutRef<typeof TextInput> &
	ThemeProps & {
		_focused?: {
			borderColor?: string;
			borderWidth?: number;
		};
		validationError?: string;
		isFormGroup?: boolean;
		shouldFocusOnRender?: boolean;
	};

const StyledInput = styled.TextInput<InputProps>`
	${layout}
	${color}
    ${space}
    ${typography}
    ${border}
` as StyledComponent<typeof TextInput, DefaultTheme, InputProps, never>;

StyledInput.defaultProps = {
	width: "100%",
	color: "text",
	backgroundColor: "alt.100",
	fontSize: "base",
	paddingX: 12,
	paddingY: IS_ANDROID ? 12 : 16,
	borderRadius: 9,
	placeholderTextColor: "rgba(100,100,100,0.4)",
	underlineColorAndroid: "transparent",
};

export default function Input({ onFocus, onBlur, isFormGroup, shouldFocusOnRender, ...props }: InputProps) {
	const {
		theme: { colors },
	} = useTheme();
	const { primary } = colors;

	const [focused, setFocused] = useState(false);
	const ref = useRef<TextInput>(null);

	useEffect(() => {
		if (shouldFocusOnRender && ref.current) ref.current.focus();
	}, [shouldFocusOnRender]);

	const bw = useMemo(
		() => (!isFormGroup && (focused || !!props.validationError) ? props?._focused?.borderWidth ?? 1 : props?.borderWidth ?? 0),
		[focused, isFormGroup, props.validationError]
	);
	const bc = useMemo(
		() => (!isFormGroup && focused ? props?._focused?.borderColor ?? "primary" : !!props.validationError ? "red.500" : props?.borderColor ?? ""),
		[focused, props.validationError]
	);
	const bg = useMemo(() => (isFormGroup ? "transparent" : props?.backgroundColor || props?.bg || "alt.100"), [isFormGroup]);

	function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
		setFocused(true);
		if (onFocus) onFocus(e);
	}

	function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
		setFocused(false);
		if (onBlur) onBlur(e);
	}

	const key = useMemo(() => props.placeholder || uuid?.v4()?.toString(), [props.placeholder]);

	return (
		<Fragment>
			<StyledInput
				{...props}
				ref={ref}
				key={key}
				value={props.value}
				color={props?.editable == false ? `${colors.text}50` : props?.color || "text"}
				backgroundColor={bg}
				borderWidth={bw}
				borderColor={bc as any}
				onFocus={handleFocus}
				onBlur={handleBlur}
				selectionColor={props?.selectionColor || primary}
				cursorColor={props?.cursorColor || primary}
			/>
			{!!props.validationError && !focused ? (
				<Text color="red.500" fontSize="sm" mt={isFormGroup ? 0 : "base"} px={isFormGroup ? "md" : "sm"} py={isFormGroup ? "md" : 0}>
					{props.validationError}
				</Text>
			) : null}
		</Fragment>
	);
}
