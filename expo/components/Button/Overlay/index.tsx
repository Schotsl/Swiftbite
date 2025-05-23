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
    height -
    variables.heightNavigation -
    variables.heightOverlay -
    adjustedTab +
    8;

  return (
    <View
      style={{
        top: adjustedTop,
        left: 0,
        right: 0,
        position: "absolute",
        backgroundColor: variables.colors.greyLight,

        padding: variables.padding.page,
        paddingVertical: 12,

        borderTopWidth: variables.border.width,
        borderTopColor: variables.border.color,

        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.025,
      }}
    >
      <Button {...props} />
    </View>
  );
}
