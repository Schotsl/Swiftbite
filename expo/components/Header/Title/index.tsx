import { Text } from "react-native";
import { ReactNode } from "react";

type HeaderTitleProps = {
  children: ReactNode;
};

export default function HeaderTitle({ children }: HeaderTitleProps) {
  return (
    <Text
      style={{
        fontSize: 28,
        fontWeight: "semibold",
        fontFamily: "OpenSans_600SemiBold",
      }}
    >
      {children}
    </Text>
  );
}
