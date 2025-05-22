import { ReactNode } from "react";
import { TextWeight } from "./types";
import { StyleProp, TextStyle, Text as ReactText } from "react-native";
import variables from "@/variables";

type TextProps = {
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  align?: "left" | "center" | "right";
  weight?: TextWeight;
  children: string | number | ReactNode;
  truncate?: boolean;
};

const fontWeights: Record<TextWeight, string> = {
  bold: "OpenSans_700Bold",
  light: "OpenSans_300Light",
  normal: "OpenSans_400Regular",
  medium: "OpenSans_500Medium",
  semibold: "OpenSans_600SemiBold",
};

export default function Text({
  size,
  color,
  style,
  weight = "normal",
  align = "left",
  children,
  truncate = false,
}: TextProps) {
  const family = fontWeights[weight];
  console.log(family);
  return (
    <ReactText
      style={[
        {
          color: color || variables.colors.text.primary,
          fontFamily: family,
          fontSize: size,
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={truncate ? 1 : undefined}
    >
      {children}
    </ReactText>
  );
}
