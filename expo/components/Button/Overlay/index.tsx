import { View, useWindowDimensions } from "react-native";

import Button, { ButtonProps } from "@/components/Button";

export default function ButtonOverlay({ ...props }: ButtonProps) {
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        top: height - 214 - 16,
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
