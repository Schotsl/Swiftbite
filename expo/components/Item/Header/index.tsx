import { View, Text } from "react-native";

type ItemHeaderProps = {
  title: string;
  subtitle: string;
};

export default function ItemHeader({ title, subtitle }: ItemHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",

        paddingHorizontal: 32,
        paddingVertical: 8,

        borderColor: "#000",
        borderBottomWidth: 2,

        backgroundColor: "#E5E5E5",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
