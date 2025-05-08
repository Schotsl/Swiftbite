import { View, useWindowDimensions } from "react-native";

import Button, { ButtonProps } from "@/components/Button";
import variables from "@/variables";

type ButtonOverlayProps = ButtonProps & {
  tab?: boolean;
};

export default function ButtonOverlay({
  tab = false,
  ...props
}: ButtonOverlayProps) {
  const { height } = useWindowDimensions();

  const adjustedTab = tab ? variables.heightTab : 0;
  const adjustedTop =
    height - variables.heightNavigation - variables.heightOverlay - adjustedTab;

  return (
    <View
      style={{
        top: adjustedTop,
        left: 0,
        right: 0,
        position: "absolute",
        backgroundColor: "#fff",

        padding: 32,
        paddingVertical: 16,

        borderTopWidth: 2,
        borderTopColor: "#000",
      }}
    >
      <Button {...props} />
    </View>
  );
}
