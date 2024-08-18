import styled from "styled-components"
import { StyledText } from "./Text"
import { TextProps } from "./props"

const StyledHeading = styled(StyledText)``

export default function Heading({ children, ...props }: TextProps) {
  return <StyledHeading {...props}>{children}</StyledHeading>
}

(StyledHeading.defaultProps as TextProps) = {
  color: "primary",
  fontSize: "4xl",
  fontWeight: "bold"
}
