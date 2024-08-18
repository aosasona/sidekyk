import useTheme from "@sidekyk/hooks/useTheme";
import { ComponentPropsWithoutRef } from "react";
import { ActivityIndicator } from "react-native";

type SpinnerProps = ComponentPropsWithoutRef<typeof ActivityIndicator> & {
    color?: string;
    isLoading?: boolean;
    usePrimaryColor?: boolean;
};

export default function Spinner({ isLoading = true, ...props }: SpinnerProps) {
    const {
        colorScheme,
        theme: { colors },
    } = useTheme();

    if (!isLoading) {
        return null;
    }

    return <ActivityIndicator {...props} color={props.color ?? props?.usePrimaryColor ? colors.primary : colorScheme == "dark" ? "white" : "black"} />;
}
