import { getPersonalities } from "@sidekyk/lib/requests/sidekyk";
import { CreateSidekykBody } from "@sidekyk/lib/types/generated";
import { memo } from "react";
import Box from "../Box";
import Input from "../Input";
import { Label, Text } from "../Text";
import useSWRImmutable from "swr/immutable";
import Spinner from "../Spinner";
import TextArea from "../TextArea";
import { AnimatePresence, MotiView } from "moti";
import { capitaliseFirst } from "@sidekyk/lib/string";
import { ValidationErrors } from "@sidekyk/lib/types/requests";
import Dropdown from "../Dropdown";

type DetailsSegmentProps = {
	data: CreateSidekykBody;
	errors: ValidationErrors<CreateSidekykBody>;
	onChange: <T extends keyof CreateSidekykBody>(key: T, value: Required<CreateSidekykBody>[T]) => void;
};

const INSTRUCTION_MAX_LENGTH = 200;

function DetailsSegment({ data, errors, onChange }: DetailsSegmentProps) {
	const { data: personalities, isLoading: isLoadingPersonalities } = useSWRImmutable("personalities", getPersonalities);

	if (isLoadingPersonalities) {
		return (
			<Box flex={1} alignItems="center" justifyContent="center">
				<Spinner />
				<Text fontSize="sm" mt="base">
					Loading personalities...
				</Text>
			</Box>
		);
	}

	const getPersonality = (id: number) => capitaliseFirst(personalities?.find((personality) => personality.id === id)?.name ?? "");

	return (
		<Box pb="3xl">
			<Box mb="lg">
				<Label>Name</Label>
				<Input keyboardType="ascii-capable" value={data.name} placeholder="Alicia" onChangeText={(e) => onChange("name", e)} validationError={errors?.name} />
			</Box>

			{personalities && personalities.length > 0 ? (
				<Box mb="lg">
					<Label>Personality</Label>

					<Dropdown
						items={personalities ?? []}
						keyExtractor={(item) => item.id.toString()}
						selectedItem={data.personality_id as any}
						renderListItem={({ item }) => capitaliseFirst(item.name)}
						renderSelectedItem={(id) => getPersonality(id) ?? "Unknown"}
						onSelect={(item) => onChange("personality_id", item.id)}
						determineSelected={(item) => item.id === data.personality_id}
					/>

					{errors?.personality_id ? (
						<Text color="red.500" mt="md">
							{errors.personality_id}
						</Text>
					) : null}
				</Box>
			) : null}
			<AnimatePresence>
				{data.personality_id === 0 ? (
					<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "timing", duration: 150 }} style={{ marginBottom: 16 }}>
						<Box flexDirection="row" alignItems="center" justifyContent="space-between" mb="xs">
							<Label>Instruction</Label>
							<Label fontSize="sm" stringify={false}>
								{data.instruction?.length ?? 0}/{INSTRUCTION_MAX_LENGTH}
							</Label>
						</Box>
						<TextArea
							value={data.instruction}
							placeholder="a part of the X-men with infinite knowledge of the universe, with a great sense of humour"
							onChangeText={(e) => onChange("instruction", e)}
							validationError={errors?.instruction}
							maxLength={INSTRUCTION_MAX_LENGTH}
						/>
					</MotiView>
				) : null}
			</AnimatePresence>
		</Box>
	);
}

export default memo(DetailsSegment);
