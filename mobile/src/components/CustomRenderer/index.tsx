import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ThemeType } from "@sidekyk/lib/types/theme";
import { ReactNode } from "react";
import { ScrollView, TextStyle, ViewStyle } from "react-native";
import { Renderer, RendererInterface } from "react-native-marked";
import Box from "../Box";
import { Text } from "../Text";

/** @ts-ignore */
import SyntaxHighlighter from "react-native-syntax-highlighter";
/** @ts-ignore */
import { atomOneDark } from "react-syntax-highlighter/styles/hljs";
import CustomPressable from "../CustomPressable";
import { showErrorAlert } from "@sidekyk/lib/error";
import { toast } from "burnt";

class CustomRenderer extends Renderer implements RendererInterface {
	private theme: ThemeType;

	constructor(theme: ThemeType) {
		super();
		this.theme = theme;
	}

	private copy(text: string) {
		if (!text || typeof text != "string") return;
		Clipboard.setStringAsync(text)
			.then(() => toast({ title: "Copied to clipboard", preset: "none" }))
			.catch(showErrorAlert);
	}

	text(text: string | ReactNode[], style?: TextStyle | undefined): ReactNode {
		return (
			<Text key={this.getKey()} style={style}>
				{text}
			</Text>
		);
	}

	paragraph(children: ReactNode[], _?: ViewStyle | undefined): ReactNode {
		return <Box key={this.getKey()}>{children}</Box>;
	}

	code(text: string, _language?: string | undefined, _?: ViewStyle | undefined, __?: TextStyle | undefined): ReactNode {
		return (
			<Box key={this.getKey()} my={8} bg="#272C34" borderRadius={8} overflow="hidden">
				<Box position="absolute" bg="gray.700" bottom={8} right={8} zIndex={10} borderRadius={5} px={8} py={6}>
					<CustomPressable onPress={() => this.copy(text)}>
						<Box alignItems="center" flexDirection="row">
							<Ionicons name="copy-outline" size={14} color={this.theme.colors.gray[400]} />
							<Text color="gray.400" fontSize="sm" ml="sm">
								Copy
							</Text>
						</Box>
					</CustomPressable>
				</Box>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<Box p="base" onStartShouldSetResponder={() => true}>
						<SyntaxHighlighter language={_language} style={atomOneDark} highlighter="hljs">
							{text}
						</SyntaxHighlighter>
					</Box>
				</ScrollView>
			</Box>
		);
	}
}

export default CustomRenderer;
