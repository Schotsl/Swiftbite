import { router } from "expo-router";
import { Text, View } from "react-native";

import HeaderTitle from "./Title";
import ButtonSmall, { ButtonSmallProps } from "../Button/Small";

type HeaderProps = {
  title: string;
  small?: boolean;
  content?: string | null;
  buttons?: ButtonSmallProps[];
  onDelete?: () => void;
  onRepeat?: () => void;
  onFavorite?: () => void;
};

export default function Header({
  title,
  small = false,
  content,
  buttons,
  onDelete,
  onRepeat,
  onFavorite,
}: HeaderProps) {
  return (
    <View
      style={{
        gap: 12,
        width: "100%",
        flexDirection: "column",
        paddingBottom: small ? 24 : 48,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <ButtonSmall
          icon="arrow-left"
          style={{ marginRight: "auto" }}
          onPress={() => router.back()}
        />

        {buttons?.map((button, index) => (
          <ButtonSmall key={index} {...button} />
        ))}

        {onDelete && <ButtonSmall icon="trash" onPress={onDelete} />}

        {onFavorite && <ButtonSmall icon="heart" onPress={onFavorite} />}

        {onRepeat && <ButtonSmall icon="repeat" onPress={onRepeat} />}
      </View>

      <HeaderTitle>{title}</HeaderTitle>

      {content && (
        <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular" }}>
          {content}
        </Text>
      )}
    </View>
  );
}
