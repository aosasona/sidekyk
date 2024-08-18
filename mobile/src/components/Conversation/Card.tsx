import { GetConversationResponse, GetSidekykResponse } from "@sidekyk/lib/types/generated";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { Hex, ThemeType } from "@sidekyk/lib/types/theme";
import Box from "../Box";
import CustomPressable from "../CustomPressable";
import ProfileImage from "../ProfileImage";
import { Text } from "../Text";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "../Swipeable";
import { LeftItems, RightItems } from "./SwipeActions";
import { memo, useState } from "react";

type Props = {
	conversation: GetConversationResponse;
	navigation: AppStackScreenProps<"Home">["navigation"];
	colors: ThemeType["colors"];
	userID: number;
	removeFromList: (conversationID: number) => void;
};

function ConversationCard({ conversation, navigation, colors, userID, removeFromList }: Props) {
	const [title, setTitle] = useState(conversation.title);

	dayjs.extend(relativeTime);
	const lastUpdated = dayjs(new Date((conversation.last_message?.created_at ?? 0) * 1000)).fromNow();
	const left = () => <LeftItems conversationId={conversation.conversation_id} currentTitle={conversation.title} isPublic={conversation.is_public} cb={(t) => setTitle(t)} />;
	const right = () => <RightItems conversationId={conversation.conversation_id} cb={() => removeFromList(conversation.conversation_id)} />;

	return (
		<Swipeable LeftItems={left} RightItems={right} overshootLeft={false} overshootRight={false} friction={1.5}>
			<CustomPressable
				onPress={() =>
					navigation.push("Conversation", { conversationID: conversation.conversation_id, sidekyk: { user_id: userID, ...conversation.sidekyk } as GetSidekykResponse })
				}
				retainOpacity>
				<Box bg="bg">
					<Box flexDirection="row" alignItems="center" ml="container">
						<Box>
							<ProfileImage uri={conversation.sidekyk.avatar_url} size={46} bg={conversation.sidekyk.color as Hex} padding={10} my="base" />
						</Box>
						<Box width={6} />
						<Box flexShrink={1} width="100%" height="100%" borderBottomWidth={0.8} borderBottomColor="alt.100" py="md" pl="base" pr="md">
							<Box flexDirection="row" alignItems="center" justifyContent="space-between">
								<Box flexShrink={1} mr="base">
									<Text numberOfLines={1}>{title}</Text>
								</Box>
								<Box flexDirection="row" alignItems="center">
									<Text fontSize="sm" fontWeight={400} color="alt.400" numberOfLines={1}>
										{lastUpdated}
									</Text>
									<Ionicons name="ios-chevron-forward-outline" size={12} color={colors.alt[200]} style={{ marginLeft: 2 }} />
								</Box>
							</Box>
							<Box flexShrink={1}>
								<Text fontSize="sm" fontWeight={400} color="alt.400" lineHeight="20px" mt="base" numberOfLines={1}>
									{conversation.last_message.is_bot ? conversation.sidekyk.name : "You"}: {conversation.last_message.content}
								</Text>
							</Box>
						</Box>
					</Box>
				</Box>
			</CustomPressable>
		</Swipeable>
	);
}

export default memo(ConversationCard);
