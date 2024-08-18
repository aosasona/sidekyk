import styled from "styled-components";
import { StyledText } from "./Text";
import { TextProps } from "./props";

const StyledLabel = styled(StyledText)``;

type LabelProps = TextProps & {
	stringify?: boolean;
	capitalize?: boolean;
};

export default function Label({ children, stringify = true, capitalize = true, ...props }: LabelProps) {
	const valueToRender = stringify ? (capitalize ? children?.toString()?.toUpperCase() : children?.toString()) : children;

	return (
		<StyledLabel {...props} lineHeight={props.lineHeight ?? "18px"}>
			{valueToRender}
		</StyledLabel>
	);
}

(StyledLabel.defaultProps as TextProps) = {
	color: "alt.400",
	fontWeight: 400,
	fontSize: 12.5,
	paddingX: "base",
	marginBottom: 6,
	letterSpacing: 0.7,
};
