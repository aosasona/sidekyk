import { Box, Label, ProgressBar, SafeView, ScrollView, SettingsItem, Text } from "@sidekyk/components";
import Divider from "@sidekyk/components/Divider";
import { comingSoon } from "@sidekyk/lib/constants";
import { showErrorAlert } from "@sidekyk/lib/error";
import { getUsage } from "@sidekyk/lib/requests/user";
import { GetUsageResponse } from "@sidekyk/lib/types/generated";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useUserStore } from "@sidekyk/stores";
import { AnimatePresence, MotiView } from "moti";
import { FlatList, Linking } from "react-native";
import useSwr from "swr";

export default function UsageScreen(_: SettingsStackScreenProps<"Usage">) {
	const user = useUserStore();

	const { data } = useSwr("usage", getUsage);

	const renderUsageCategory = ({ item: category }: { item: GetUsageResponse[keyof GetUsageResponse] }) => {
		return (
			<Box px="container" py="container">
				<Box flexDirection="row" justifyContent="space-between" alignItems="center">
					<Text fontWeight={600}>{category.field_title}</Text>
					<Text color="alt.400" fontSize="sm" px="xs">
						{category.used}/{category.total?.toLocaleString()}
					</Text>
				</Box>
				<ProgressBar height={7} total={category.total} progress={category.used} mt="md" />
				<Text color="alt.400" fontSize="sm" fontWeight={400} mt="md" lineHeight="21px">
					{category.description}
				</Text>
			</Box>
		);
	};

	function extractKey(item: GetUsageResponse[keyof GetUsageResponse]) {
		return item.field_title;
	}

	return (
		<SafeView forceInset={{ top: "never" }} isModal>
			<ScrollView flex={1} px="container">
				<Box mt="xl">
					<Box bg="alt.100" borderRadius={10}>
						<Box flexDirection="row" justifyContent="space-between" alignItems="center" px={12} py={14}>
							<Text>Current plan</Text>
							<Text color={user.subscription_type == "FREE" ? "alt.400" : "emerald.400"} fontSize="sm" fontWeight={600}>
								{user?.subscription_type?.replace("_", " ")} {user.is_trial ? " (TRIAL)" : ""}
							</Text>
						</Box>
						<Divider />
						<SettingsItem title="View all plans" single={false} showBorder={false} action={() => Linking.openURL("https://www.sidekyk.app/pricing").then().catch(showErrorAlert)} />
					</Box>

					<Text color="alt.400" fontSize="sm" lineHeight="20px" px="base" mt="base">
						You can't manage your subscription from the app, sorry! :(
					</Text>
				</Box>

				<AnimatePresence>
					{data ? (
						<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 32 }}>
							<Label>Current Usage</Label>
							<Box flex={1} bg="alt.100" borderRadius={10}>
								<FlatList data={Object.values(data)} keyExtractor={extractKey} renderItem={renderUsageCategory} ItemSeparatorComponent={Divider} scrollEnabled={false} />
							</Box>
						</MotiView>
					) : null}
				</AnimatePresence>
			</ScrollView>
		</SafeView>
	);
}
