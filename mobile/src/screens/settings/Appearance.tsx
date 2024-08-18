import { FlashList } from "@shopify/flash-list";
import { Box, Label, Text, SafeView, ScrollView, CustomPressable, SettingsItem, Button, ColorPicker, Dropdown } from "@sidekyk/components";
import { useConfigStore } from "@sidekyk/stores";
import { ChatDisplayMode } from "@sidekyk/stores/config";
import { useCallback, useState } from "react";
import { returnedResults } from "reanimated-color-picker";

const ACCENT_COLORS = ["#EF4343", "#db2777", "#0066FE", "#71B6DA", "#6366f1", "#7c3aed", "#059669", "#89CC78", "#06b6d4", "#eab308", "#fb923c", "#8F94A2"];

type ChatDispayStyles = Record<ChatDisplayMode, { style_name: string }>;

const chatDisplayStyles: ChatDispayStyles = {
	list: {
		style_name: "List (Discord, Snapchat etc)",
	},
	bubble: {
		style_name: "Bubble (iMessage, WhatsApp etc)",
	},
};

export default function AppearanceScreen() {
	const configStore = useConfigStore();

	const [customAccentColor, setCustomAccentColor] = useState<`#${string}`>(configStore.accentColor);
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

	function handleSetCustomAccentColor({ hex }: returnedResults) {
		const castHex = hex as `#${string}`;
		configStore.setAccentColor(castHex);
		setCustomAccentColor(castHex);
	}

	function renderAccentColors({ item, index }: { item: `#${string}`; index: number }) {
		const isSelected = configStore.accentColor == item;
		return (
			<Box mr="md" ml={index == 0 ? "container" : 0} mb="xs">
				<CustomPressable onPress={() => configStore.setAccentColor(item)}>
					<Box
						bg={`${item}0F`}
						alignItems="center"
						justifyItems="center"
						borderWidth={isSelected ? 1 : 0}
						borderColor={isSelected ? "primary" : "transparent"}
						borderRadius={12}
						p="lg"
						style={{ aspectRatio: 1 }}>
						<Box width={40} borderRadius={999} bg={item} style={{ aspectRatio: 1 }} />
					</Box>
				</CustomPressable>
			</Box>
		);
	}
	const memoizedRenderItem = useCallback(renderAccentColors, [configStore.accentColor]);

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
			<ScrollView flex={1} pt="lg" pb="xl">
				<Box px="container">
					<Label>App theme</Label>
					<Box bg="alt.100" borderRadius={10}>
						<SettingsItem
							icon={{ name: "ios-moon-sharp", bg: "yellow.500" }}
							title="Dark Mode"
							type="toggle"
							value={configStore.theme == "dark"}
							action={configStore.toggleTheme}
							single={false}
						/>
						<SettingsItem
							icon={{ name: "ios-moon-sharp", bg: "yellow.500" }}
							title="Use device theme"
							type="toggle"
							value={configStore.useDeviceTheme}
							action={configStore.toggleUseDeviceTheme}
							single={false}
							showBorder={false}
							showIcon={false}
						/>
					</Box>
				</Box>

				<Box mt="xl">
					<Box mb="base" px="container">
						<Label>Accent Color</Label>
					</Box>
					<FlashList
						data={ACCENT_COLORS as `#${string}`[]}
						renderItem={memoizedRenderItem}
						keyExtractor={(item) => item}
						estimatedItemSize={65}
						showsHorizontalScrollIndicator={false}
						extraData={configStore.accentColor}
						horizontal
					/>

					<Box mt="lg" px="container" nobg>
						<Button backgroundColor="primaryFaded" color="primary" onPress={() => setIsColorPickerVisible(true)} mt="base">
							Select custom color
						</Button>
					</Box>
				</Box>

				{/* TODO: implement bubble style */}
				{false ? (
					<Box px="container" mt="xl">
						<Box mb="lg">
							<Label>Chat display style</Label>

							<Box height={100} bg="alt.100" alignItems="center" justifyContent="center" borderRadius={10} mb="md">
								<Text color="alt.400">Preview goes here</Text>
							</Box>

							<Dropdown
								items={Object.keys(chatDisplayStyles) as ChatDisplayMode[]}
								selectedItem={configStore.chatDisplayMode}
								renderListItem={({ item }) => chatDisplayStyles[item].style_name}
								renderSelectedItem={(_) => chatDisplayStyles[configStore.chatDisplayMode].style_name}
								onSelect={(item) => configStore.setChatDisplayMode(item)}
								disabled={true}
							/>

							<Text color="alt.400" fontSize="sm" mt="base" px="base">
								Coming soon!
							</Text>
						</Box>
					</Box>
				) : null}
			</ScrollView>

			<ColorPicker visible={isColorPickerVisible} currentColor={customAccentColor} setVisible={setIsColorPickerVisible} onComplete={handleSetCustomAccentColor} />
		</SafeView>
	);
}
