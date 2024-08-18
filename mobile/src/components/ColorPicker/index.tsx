import useTheme from "@sidekyk/hooks/useTheme";
import { IS_IOS } from "@sidekyk/lib/constants";
import { BlurView } from "expo-blur";
import { Modal } from "react-native";
import Box from "../Box";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { default as RNColorPicker, Preview, HueSlider, returnedResults, Panel1 } from "reanimated-color-picker";
import CustomPressable from "../CustomPressable";
import { Text } from "../Text";

type ColorPickerProps = {
	visible: boolean;
	currentColor: string;
	setVisible: (visible: boolean) => void;
	onComplete: (colors: returnedResults) => void;
};

export default function ColorPicker({ visible, currentColor, onComplete, setVisible }: ColorPickerProps) {
	const { theme, colorScheme } = useTheme();
	const { top } = useSafeAreaInsets();

	return (
		<Modal
			animationType="slide"
			visible={visible}
			onRequestClose={() => setVisible(false)}
			transparent={true}
			style={{ backgroundColor: "transparent", marginHorizontal: theme.space.container }}>
			<BlurView intensity={IS_IOS ? 60 : 120} tint={colorScheme} style={{ flex: 1, paddingTop: top }}>
				<Box flex={1} justifyContent="center" px="md">
					<BlurView intensity={IS_IOS ? 100 : 150} tint={colorScheme} style={{ borderRadius: 8, zIndex: 999, overflow: "hidden" }}>
						<Box px="lg" py="lg">
							<RNColorPicker value={currentColor} onComplete={onComplete}>
								<Preview />
								<Box my="md">
									<Panel1 />
								</Box>
								<HueSlider />
							</RNColorPicker>
						</Box>
					</BlurView>
					<Box alignItems="center" justifyContent="center" mt="2xl">
						<CustomPressable onPress={() => setVisible(false)}>
							<Box bg="primaryFaded" px="lg" py="base" borderWidth={1} borderColor="primary" borderRadius={20}>
								<Text color="primary">Dismiss</Text>
							</Box>
						</CustomPressable>
					</Box>
				</Box>
			</BlurView>
		</Modal>
	);
}
