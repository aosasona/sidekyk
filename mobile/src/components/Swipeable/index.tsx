import { FunctionComponent, ReactNode, useRef } from "react";
import { Animated } from "react-native";
import RNSwipeable, { SwipeableProps } from "react-native-gesture-handler/Swipeable";
import Box from "../Box";

type ItemProps = {
	onClose: () => Promise<void> | void;
};

type ExtendedSwipeableProps = SwipeableProps & {
	children: ReactNode;
	enableSwipe?: boolean;
	LeftItems?: FunctionComponent<ItemProps>;
	RightItems?: FunctionComponent<ItemProps>;
};

type AnimatedInterpolation = ReturnType<Animated.Value["interpolate"]>;

function SwipeableContainer({ children, isRight }: { children: ReactNode; isRight?: boolean }) {
	return (
		<Box height="100%" justifyContent="center" alignItems={isRight ? "flex-end" : "flex-start"}>
			{children}
		</Box>
	);
}

export default function Swipeable({ children, LeftItems, RightItems, enableSwipe = true, ...props }: ExtendedSwipeableProps) {
	const ref = useRef<RNSwipeable>(null);

	function onClose() {
		ref.current?.close();
	}

	function renderLeftActions(_: AnimatedInterpolation, __: AnimatedInterpolation) {
		if (!enableSwipe || !LeftItems) return null;
		return (
			<SwipeableContainer>
				<LeftItems onClose={onClose} />
			</SwipeableContainer>
		);
	}

	function renderRightActions(_: AnimatedInterpolation, __: AnimatedInterpolation) {
		if (!enableSwipe || !RightItems) return null;
		return (
			<SwipeableContainer isRight>
				<RightItems onClose={onClose} />
			</SwipeableContainer>
		);
	}

	return (
		<RNSwipeable {...props} ref={ref} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
			{children}
		</RNSwipeable>
	);
}
