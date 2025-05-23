import { Link, Href } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import variables from "@/variables";

type ButtonProps = {
  href: Href;
  icon: keyof typeof FontAwesome6.glyphMap;
  right?: boolean;
};

export default function TabsButton({ href, icon, right }: ButtonProps) {
  return (
    <Link
      href={href}
      style={{
        top: right ? 12 : undefined,
        right: right ? variables.padding.page : undefined,
        position: right ? "absolute" : undefined,

        width: 28,
        height: 28,
        borderRadius: 100,

        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: variables.colors.background.secondary,
      }}
      asChild
    >
      <Pressable>
        <FontAwesome6
          name={icon}
          size={14}
          color={variables.colors.text.secondary}
        />
      </Pressable>
    </Link>
  );
}
