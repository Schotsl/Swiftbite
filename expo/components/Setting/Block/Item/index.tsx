import { Href, Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type SettingBlockItemProps = {
  last: boolean;
  href: Href;
  title: string;
  content: string;
};

export default function SettingBlockItem({
  last = false,
  href,
  title,
  content,
}: SettingBlockItemProps) {
  return (
    <Link asChild href={href}>
      <TouchableOpacity
        style={{
          gap: 4,
          padding: 16,

          borderColor: "#000",
          borderBottomWidth: last ? 0 : 2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            opacity: 0.75,
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {content}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
