import { ReactNode } from "react";
import { Text } from "../Text";
import Box from "../Box";
import * as DropdownMenu from "zeego/dropdown-menu";
import useTheme from "@sidekyk/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

type ListItemArgs<T> = {
	item: T;
	index: number;
	selected: boolean;
};

type Props<T> = {
	items: T[];
	selectedItem: T;
	disabled?: boolean;
	onSelect?: (item: T, index: number) => void;
	determineSelected?: (item: T | any) => boolean;
	keyExtractor?: (item: T) => string;
	renderListItem?: (args: ListItemArgs<T>) => ReactNode | string;
	renderSelectedItem?: (item: T) => string;
};

function defaultKeyExtractor<T>(item: T) {
	return item as unknown as string;
}

function defaultRenderListItem<T>({ item }: ListItemArgs<T>) {
	return item as unknown as string;
}

function defaultRenderSelectedItem<T>(item: T) {
	return item as unknown as string;
}

export default function Dropdown<T extends unknown>({
	items,
	selectedItem,
	disabled = false,
	onSelect = () => null,
	determineSelected = (item: any) => selectedItem == item,
	renderListItem = defaultRenderListItem,
	renderSelectedItem = defaultRenderSelectedItem,
	keyExtractor = defaultKeyExtractor,
}: Props<T>) {
	const {
		theme: { colors },
	} = useTheme();

	const Title = () => (
		<Box bg="alt.100" flexDirection="row" justifyContent="space-between" alignItems="center" borderRadius={8} px="md" py="lg">
			<Text fontSize="base" fontWeight={400} color="alt.500">
				{renderSelectedItem(selectedItem)}
			</Text>
			<Ionicons name="chevron-down-outline" size={16} color={colors.alt[400]} />
		</Box>
	);

	if (disabled) return <Title />;

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Title />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{items.map((item, idx) => (
					<DropdownMenu.Item key={keyExtractor(item)} onSelect={() => onSelect(item, idx)}>
						<DropdownMenu.ItemTitle>{renderListItem({ item, index: idx, selected: item == selectedItem })}</DropdownMenu.ItemTitle>
						{determineSelected(item) ? <DropdownMenu.ItemIcon ios={{ name: "checkmark.circle", pointSize: 5, weight: "medium", scale: "medium" }} /> : null}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
