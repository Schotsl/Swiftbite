import { View } from "react-native";
import { router } from "expo-router";
import { ButtonSmallProps } from "../Button/Small";

import TextBody from "@/components/Text/Body";
import TextTitle from "@/components/Text/Title";
import ButtonSmall from "../Button/Small";
import variables from "@/variables";

type HeaderProps = {
  title: string;
  content?: string | null;
  buttons?: ButtonSmallProps[];
  favorite?: boolean;
  onDelete?: () => void;
  onRepeat?: () => void;
  onFavorite?: () => void;
};

export default function Header({
  title,
  content,
  buttons,
  favorite = false,
  onDelete,
  onRepeat,
  onFavorite,
}: HeaderProps) {
  return (
    <View
      style={{
        gap: variables.gap.small,
        width: "100%",
        flexDirection: "column",
        paddingBottom: variables.gap.normal,
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
          <ButtonSmall
            icon="heart"
            action={favorite ? "secondary" : "primary"}
            onPress={onFavorite}
          />
        )}
      </View>

      <TextTitle>{title}</TextTitle>

      {content && <TextBody>{content}</TextBody>}
    </View>
  );
}
