import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useConfigStore } from "@sidekyk/stores";

type Props = {
	accentColor: string;
	navigation: AppStackScreenProps<"Home">["navigation"];
};

export default function HomeMenu({ accentColor, navigation }: Props) {
	const config = useConfigStore();
	const openSettings = () => navigation.navigate("SettingsStack");
	const newSidekyk = () => navigation.push("Create Sidekyk");

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Ionicons name="ios-ellipsis-horizontal-circle-outline" size={28} color={accentColor} />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item key="new-sidekyk" onSelect={newSidekyk}>
					<DropdownMenu.ItemTitle>Create new sidekick</DropdownMenu.ItemTitle>
					<DropdownMenu.ItemIcon ios={{ name: "plus.circle", pointSize: 5, weight: "medium", scale: "medium" }} />
				</DropdownMenu.Item>

				<DropdownMenu.Item key="toggle-theme" onSelect={config.toggleTheme}>
					<DropdownMenu.ItemTitle>Toggle theme</DropdownMenu.ItemTitle>
					<DropdownMenu.ItemIcon ios={{ name: "moon", pointSize: 5, weight: "medium", scale: "medium" }} />
				</DropdownMenu.Item>

				<DropdownMenu.Item key="settings" onSelect={openSettings}>
					<DropdownMenu.ItemTitle>Settings</DropdownMenu.ItemTitle>
					<DropdownMenu.ItemIcon ios={{ name: "gearshape", pointSize: 5, weight: "medium", scale: "medium" }} />
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
