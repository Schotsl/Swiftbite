import { View } from "react-native";
import { router } from "expo-router";
import { ButtonSmallProps } from "../Button/Small";

import TextBody from "@/components/Text/Body";
import TextTitle from "@/components/Text/Title";
import ButtonSmall from "../Button/Small";

type HeaderProps = {
  title: string;
  content?: string | null;
  buttons?: ButtonSmallProps[];
  small?: boolean;
  favorite?: boolean;
  onDelete?: () => void;
  onRepeat?: () => void;
  onFavorite?: () => void;
};

export default function Header({
  title,
  content,
  buttons,
  small = false,
  favorite = false,
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

        {onRepeat && <ButtonSmall icon="repeat" onPress={onRepeat} />}

        {onFavorite && (
          <ButtonSmall icon="heart" onPress={onFavorite} gradient={favorite} />
        )}
      </View>

      <TextTitle>{title}</TextTitle>

      {content && <TextBody>{content}</TextBody>}
    </View>
  );
}
