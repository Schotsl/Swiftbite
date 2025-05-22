import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold";

export type TextWithoutSizeProps = {
  color?: string;
  style?: StyleProp<TextStyle>;
  align?: "left" | "center" | "right";
  weight?: TextWeight;
  children: string | number | ReactNode;
  truncate?: boolean;
};
