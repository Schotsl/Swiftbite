import { ReactNode } from "react";
import { TextWeight } from "./types";
import { StyleProp, TextStyle, Text as ReactText } from "react-native";

type TextProps = {
  size: number;
  style?: StyleProp<TextStyle>;
  weight?: TextWeight;
  children: string | number | ReactNode;
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
  style,
  weight = "normal",
  children,
}: TextProps) {
  const family = fontWeights[weight];

  return (
    <ReactText style={[{ fontFamily: family, fontSize: size }, style]}>
      {children}
    </ReactText>
  );
}
