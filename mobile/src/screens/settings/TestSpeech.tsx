import { Box, SafeView, ScrollView, Text } from "@sidekyk/components";
import { useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranscription } from "@sidekyk/hooks/audio";
import { TranscriptionResult } from "@sidekyk/lib/types/speech";

export default function TestSpeechScreen() {
	const [transcript, setTranscript] = useState("");
	const { start, stop, engine, isListening, canTranscribe } = useTranscription(onResult);

	function onResult({ result }: TranscriptionResult) {
		setTranscript((prev) => (!transcript ? result : prev + "\n" + result));
	}

	return (
		<SafeView forceInset={{ top: "never" }} isModal>
			{canTranscribe ? (
				<Box flex={1} alignItems="center" justifyContent="space-between" pt="lg" pb="xl" nobg>
					<Box bg="alt.100" px="lg" py="base" borderRadius={18}>
						<Text fontSize="sm">Current engine: {engine}</Text>
					</Box>
					<Box bg="alt.100" width="90%" height="70%" borderRadius={16}>
						<ScrollView flex={1} py="lg" px="lg">
							<Text color="text" fontWeight={600} fontSize="xl">
								{transcript}
							</Text>
						</ScrollView>
					</Box>

					<Text fontSize="xl" fontWeight="bold" color="alt.800">
						{isListening ? "Listening..." : "Not listening"}
					</Text>

					<Pressable
						onPressIn={() => start().then().catch(console.error)}
						onPressOut={() => stop().then().catch(console.error)}
						style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
						<Box width={96} height={96} bg="primary" alignItems="center" justifyContent="center" borderRadius={999}>
							<Ionicons name="ios-mic-sharp" size={48} color="white" />
						</Box>
					</Pressable>
				</Box>
			) : (
				<Box flex={1} alignItems="center" justifyContent="center">
					<Text>Your device does not support speech recognition.</Text>
				</Box>
			)}
		</SafeView>
	);
}
