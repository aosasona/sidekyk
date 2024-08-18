import { ComponentPropsWithoutRef } from "react";
import { ColorProps, LayoutProps, SpaceProps, TypographyProps } from "styled-system";
import { Text as NativeText } from "react-native"
import { ThemeProps } from "@sidekyk/lib/types/theme";

export type TextProps = LayoutProps & TypographyProps & ColorProps & SpaceProps & ComponentPropsWithoutRef<typeof NativeText> & ThemeProps
