import { useMemo, memo } from "react";
import { Message } from "@sidekyk/lib/types/generated";
import Box from "../Box";
import { ThemeType } from "@sidekyk/lib/types/theme";
import * as Clipboard from "expo-clipboard";
import { showErrorAlert } from "@sidekyk/lib/error";
import { toast } from "burnt";
import Markdown from "react-native-marked";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CustomRenderer from "../CustomRenderer";
import CustomPressable from "../CustomPressable";

type Props = {
	message: Message;
	theme: ThemeType;
};

type InnerComponentProps = {
	message: Message;
	SharedMarkdownComponent: React.FC;
};

const actionSheetOptions = ["Copy", "Cancel"];
const cancelIndex = 1;

export default function ChatBubble({ theme, ...props }: Props) {
	const renderer = useMemo(() => new CustomRenderer(theme), [theme]);
	const { showActionSheetWithOptions } = useActionSheet();

	function handleLongPress() {
		showActionSheetWithOptions(
			{
				options: actionSheetOptions,
				cancelButtonIndex: cancelIndex,
			},
			(idx?: number) => {
				switch (idx) {
					case 0:
						copyMessage();
						break;

					case cancelIndex:
						break;
				}
			}
		);
	}

	function SharedMarkdownComponent() {
		const mdThemeColors = {
			background: "transparent",
			code: `${theme.colors.alt[200]}44`,
			link: props.message.is_bot ? theme.colors.primary : theme.colors.brandWhite,
			text: props.message.is_bot ? theme.colors.text : theme.colors.brandWhite,
			border: theme.colors.primaryFaded,
		};
		return (
			<Markdown
				value={props.message.content?.trim()}
				renderer={renderer}
				flatListProps={{
					showsHorizontalScrollIndicator: false,
					showsVerticalScrollIndicator: false,
					keyExtractor: (_, idx) => idx?.toString(),
					style: { backgroundColor: "transparent" },
					scrollEnabled: false,
				}}
				theme={{ colors: mdThemeColors }}
			/>
		);
	}

	const SharedMarkdownComponentMemo = useMemo(() => memo(SharedMarkdownComponent), [props.message.content, theme]);

	function copyMessage() {
		Clipboard.setStringAsync(props.message.content)
			.then(() => toast({ title: "Copied to clipboard", preset: "none" }))
			.catch(showErrorAlert);
	}

	return (
		<CustomPressable onLongPress={handleLongPress} retainOpacity>
			<Bubble {...props} SharedMarkdownComponent={SharedMarkdownComponentMemo} />
		</CustomPressable>
	);
}

function Bubble({ message: { content, is_bot }, SharedMarkdownComponent }: InnerComponentProps) {
	const isLongerThanOneLine = useMemo(() => content?.split(" ")?.length > 7 && content?.length > 40, [content]);

	return (
		<Box
			bg={is_bot ? "alt.100" : "primary"}
			maxWidth="80%"
			alignSelf={is_bot ? "flex-start" : "flex-end"}
			justifyContent="flex-start"
			px={14}
			py={8}
			mb="md"
			borderRadius={isLongerThanOneLine ? 12 : 24}>
			<SharedMarkdownComponent />
		</Box>
	);
}
