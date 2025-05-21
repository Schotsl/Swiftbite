import variables from "@/variables";

import { Day } from "../types";
import { ViewStyle } from "react-native";

export const getStyle = ({ color, border }: Day): ViewStyle => {
  let backgroundColor = "transparent";

  if (color === "grey") {
    backgroundColor = variables.colors.grey;
  } else if (color === "primary") {
    backgroundColor = variables.colors.primaryLight;
  }

  const borderWidth = border === "thick" ? 3 : 2;
  const borderStyle = border === "dashed" ? "dashed" : "solid";
  const borderColor =
    border === "none" ? "transparent" : variables.colors.primary;

  return {
    width: variables.circle.small,
    height: variables.circle.small,
    backgroundColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius: variables.circle.small,
    alignItems: "center",
    justifyContent: "center",
  };
};
