import { Href } from "expo-router";
import { View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import SettingBlockItem from "./Item";

type ItemBase = {
  icon?: keyof typeof FontAwesome6.glyphMap;
  title: string;
  content: string;
  loading?: boolean;
};

type ItemWithHref = ItemBase & {
  href: Href;
  onPress?: never;
};

type ItemWithOnPress = ItemBase & {
  onPress: () => void;
  href?: never;
};

type Item = ItemWithHref | ItemWithOnPress;

type SettingBlockProps = {
  items: Item[];
};

export default function SettingBlock({ items }: SettingBlockProps) {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 8,
      }}
    >
      {items.map((item, index) => (
        <SettingBlockItem
          key={index}
          last={index === items.length - 1}
          {...item}
        />
      ))}
    </View>
  );
}
