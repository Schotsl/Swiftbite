import variables from "@/variables";

import { Day } from "../types";
import { ViewStyle } from "react-native";

export const getStyle = ({ color, border }: Day): ViewStyle => {
  let backgroundColor = variables.colors.transparent;

  if (color === "grey") {
    backgroundColor = "rgba(0, 0, 0, 0.2)";
  } else if (color === "primary") {
    backgroundColor = "rgba(0, 0, 0, 0.4)";
  }

  const borderWidth = border === "thick" ? 3 : variables.border.width;
  const borderStyle = border === "dashed" ? "dashed" : "solid";
  const borderColor =
    border === "none" ? variables.colors.transparent : variables.colors.primary;

  return {
    borderColor,
    borderWidth,
    borderStyle,
    backgroundColor,
  };
};
