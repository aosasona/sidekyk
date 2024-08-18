import { ComponentPropsWithoutRef } from "react";
import { Image as NativeImage } from "react-native";
import styled from "styled-components/native";
import { background, BackgroundProps, layout, LayoutProps } from "styled-system";

type ImageProps = LayoutProps & BackgroundProps & ComponentPropsWithoutRef<typeof NativeImage>;

const StyledImage = styled.Image<ImageProps>`
	${layout}
	${background}
`;

function Image({ ...props }: ImageProps) {
	return <StyledImage {...props} />;
}

export default Image;
