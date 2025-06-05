import { View } from "react-native";

import Button, { ButtonProps } from "@/components/Button";
import variables from "@/variables";

type ButtonOverlayProps = ButtonProps & {
  navigation?: boolean;
};

export default function ButtonOverlay({
  navigation = true,
  ...props
}: ButtonOverlayProps) {
  return (
    <View
      style={{
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        paddingBottom: navigation ? 24 : variables.gap.large,
        paddingHorizontal: variables.padding.page,

        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
      }}
    >
      <Button {...props} />
    </View>
  );
}
