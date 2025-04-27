import { Href } from "expo-router";
import { View } from "react-native";

import SettingBlockItem from "./Item";

type Item = {
  href: Href;
  title: string;
  content: string;
};

type SettingBlockProps = {
  items: Item[];
};

export default function SettingBlock({ items }: SettingBlockProps) {
  return (
    <View
      style={{
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#000",
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
