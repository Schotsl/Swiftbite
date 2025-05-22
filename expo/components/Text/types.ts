import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold";

export type TextWithoutSizeProps = {
  style?: StyleProp<TextStyle>;
  weight?: TextWeight;
  children: string | number | ReactNode;
};
