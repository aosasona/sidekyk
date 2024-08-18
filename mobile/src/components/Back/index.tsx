import Box from "../Box";
import CustomPressable from "../CustomPressable";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@sidekyk/hooks/useTheme";

type Props = {
	onPress: () => void;
};

export default function Back({ onPress }: Props) {
	const {
		theme: { colors },
	} = useTheme();
	return (
		<CustomPressable onPress={onPress}>
			<Box backgroundColor="primaryFaded" alignItems="center" justifyContent="center" borderRadius={999} p="xs" style={{ aspectRatio: 1 }}>
				<Ionicons name="chevron-back" size={22} color={colors.primary} />
			</Box>
		</CustomPressable>
	);
}
