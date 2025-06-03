import { View } from "react-native";
import { router } from "expo-router";

import variables from "@/variables";

import TextBody from "@/components/Text/Body";
import TextTitle from "@/components/Text/Title";
import ButtonSmall, { ButtonSmallProps } from "@/components/Button/Small";

type HeaderProps = {
  back?: boolean;
  title: string;
  content?: string | null;
  buttons?: ButtonSmallProps[];
  favorite?: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onFavorite?: () => void;
};

export default function Header({
  back = true,
  title,
  content,
  buttons,
  favorite = false,
  onDelete,
  onDuplicate,
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
      <View
        style={{
          gap: variables.gap.normal,
          paddingBottom: 24,
          flexDirection: "row",
        }}
      >
        {back && (
          <ButtonSmall
            icon="arrow-left"
            style={{ marginRight: "auto" }}
            onPress={() => router.back()}
          />
        )}

        {buttons?.map((button, index) => (
          <ButtonSmall key={index} {...button} />
        ))}

        {onDelete && <ButtonSmall icon="trash" onPress={onDelete} />}

        {onDuplicate && <ButtonSmall icon="copy" onPress={onDuplicate} />}

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
