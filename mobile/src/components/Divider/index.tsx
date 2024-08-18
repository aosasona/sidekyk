import useTheme from "@sidekyk/hooks/useTheme";
import { useMemo } from "react";
import Box from "../Box";

type Props = {
	bg?: string;
};

export default function Divider(props: Props) {
	const {
		colorScheme,
		theme: { colors },
	} = useTheme();

	const bg = useMemo(() => (props?.bg || colorScheme == "dark" ? `${colors.alt[200]}50` : `${colors.alt[200]}AA`), [props.bg, colorScheme]);

	return (
		<Box width="100%" pl="md" nobg>
			<Box flexGrow={1} height={0.7} bg={bg as any} />
		</Box>
	);
}
