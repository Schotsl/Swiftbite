import { View, useWindowDimensions } from "react-native";

import Button, { ButtonProps } from "@/components/Button";

type ButtonOverlayProps = ButtonProps & {
  tab?: boolean;
};

export default function ButtonOverlay({
  tab = false,
  ...props
}: ButtonOverlayProps) {
  const { height } = useWindowDimensions();

  const navHeight = 226;
  const tabHeight = tab ? 62 : 0;

  return (
    <View
      style={{
        top: height - navHeight - tabHeight,
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
