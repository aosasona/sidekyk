import styled from "styled-components/native";
import { color, layout, space, typography } from "styled-system";
import { TextProps } from "./props";

export const StyledText = styled.Text<TextProps>`
	${layout}
	${typography}
${color}
${space}
`;

function Text({ children, ...props }: TextProps) {
	return <StyledText {...props}>{children}</StyledText>;
}

(StyledText.defaultProps as TextProps) = {
	fontFamily: "Inter",
	color: "text",
	fontSize: "base",
	fontWeight: 500,
};

export default Text;
