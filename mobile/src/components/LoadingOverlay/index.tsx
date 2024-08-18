import useTheme from "@sidekyk/hooks/useTheme";
import { IS_IOS } from "@sidekyk/lib/constants";
import { BlurView } from "expo-blur";
import { Modal } from "react-native";
import Box from "../Box";
import Spinner from "../Spinner";
import { Text } from "../Text";

type Props = {
    text?: string;
    visible: boolean;
};
export default function LoadingOverlay({ text, visible }: Props) {
    const { colorScheme } = useTheme();

    return (
        <Modal animationType="slide" visible={visible} transparent={true} style={{ backgroundColor: "transparent" }}>
            <Box flex={1} backgroundColor="#00000088" alignItems="center" justifyContent="center">
                <BlurView
                    intensity={IS_IOS ? 75 : 120}
                    tint={colorScheme}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 20, overflow: "hidden" }}>
                    <Spinner />
                    <Text fontSize="base" ml="base">
                        {text}
                    </Text>
                </BlurView>
            </Box>
        </Modal>
    );
}
