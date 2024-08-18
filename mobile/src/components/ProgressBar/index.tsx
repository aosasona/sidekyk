import Box from "../Box";
import { Spacing, ThemeColor } from "@sidekyk/lib/types/theme";
import { useMemo } from "react";
type Props = {
	total: number;
	progress: number;
	bg?: ThemeColor;
	color?: ThemeColor;
	height?: number;
	borderRadius?: number;
	my?: number | Spacing;
	mt?: number | Spacing;
	mb?: number | Spacing;
};
export default function ProgressBar({ bg = "alt.200", color = "primary", height = 3, borderRadius = 8, ...props }: Props) {
	const innerWidth = useMemo(() => {
		return (props.progress / props.total) * 100;
	}, [props.progress, props.total]);

	const innerRadius = useMemo(() => (borderRadius > 0 ? borderRadius + 2 : 0), [borderRadius]);

	return (
		<Box height={height} bg={bg} borderRadius={borderRadius} overflow="hidden" {...props}>
			<Box height="100%" width={`${innerWidth}%`} bg={color} borderRadius={innerRadius} />
		</Box>
	);
}
