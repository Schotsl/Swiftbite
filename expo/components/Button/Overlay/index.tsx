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

  const getHeight = () => {
    let heightCalculated = height;

    if (tab) {
      heightCalculated -= variables.heightTab;
    }

    heightCalculated += variables.border.width;
    heightCalculated -= variables.heightNavigation;
    heightCalculated -= variables.heightOverlay;
    heightCalculated -= variables.gap.large;

    return heightCalculated;
  };

  return (
    <View
      style={{
        top: getHeight(),
        left: 0,
        right: 0,
        height: variables.heightOverlay,
        position: "absolute",

        padding: variables.padding.page,
        paddingVertical: 12,

        borderTopWidth: variables.border.width,
        borderTopColor: variables.border.color,

        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.025,

        backgroundColor: variables.colors.background.primary,
      }}
    >
      <Button {...props} />
    </View>
  );
}
