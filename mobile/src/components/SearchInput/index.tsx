import Box from "../Box";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@sidekyk/hooks/useTheme";
import { StyleSheet, TextInput } from "react-native";
import CustomPressable from "../CustomPressable";
import { AnimatePresence, MotiView } from "moti";

type SearchInputProps = {
	value: string;
	placeholder?: string;
	onChange: (text: string) => void;
};

export default function SearchInput(props: SearchInputProps = { value: "", placeholder: "Search...", onChange: () => { } }) {
	const {
		theme: { colors, space },
	} = useTheme();

	const styles = StyleSheet.create({
		textInput: {
			color: colors.text,
			marginLeft: space.sm,
			flexGrow: 1,
			paddingVertical: space.base,
		},
	});

	return (
		<Box flexDirection="row" alignItems="center" bg="alt.100" borderRadius={10} py="sm" px="base">
			<Ionicons name="ios-search" size={16} color={colors.alt[400]} />
			<TextInput
				value={props.value}
				placeholder={props.placeholder ?? "Search..."}
				onChangeText={props.onChange}
				placeholderTextColor={colors.alt[400]}
				inputMode="search"
				style={styles.textInput}
				enablesReturnKeyAutomatically
			/>
			<AnimatePresence>
				{(props?.value?.length ?? 0) > 0 ? (
					<MotiView
						from={{ opacity: 0, translateX: 6 }}
						animate={{ opacity: 1, translateX: 0 }}
						exit={{ opacity: 0, translateX: 6 }}
						transition={{ type: "timing", duration: 120 }}>
						<CustomPressable onPress={() => props.onChange("")}>
							<Ionicons name="close-circle-sharp" size={18} color={colors.alt[300]} />
						</CustomPressable>
					</MotiView>
				) : null}
			</AnimatePresence>
		</Box>
	);
}
