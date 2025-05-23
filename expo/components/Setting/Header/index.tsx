import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

import userData from "@/queries/userData";
import SettingHeaderAvatar from "./Avatar";
import { useIsFocused } from "@react-navigation/native";
import TextLarge from "@/components/Text/Large";
import TextSmall from "@/components/Text/Small";
import TextBody from "@/components/Text/Body";
import variables from "@/variables";
import language from "@/language";

export default function SettingHeader() {
  const focus = useIsFocused();

  const { data } = useQuery({
    ...userData(),
    enabled: focus,
  });

  return (
    <View
      style={{
        gap: variables.gap.normal,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <SettingHeaderAvatar />

      <View>
        <TextLarge weight="semibold">
          {data?.first_name} {data?.last_name}
        </TextLarge>

        <TextBody>
          {language.page.personal.getSubtitle(data?.total || 0)}
        </TextBody>
      </View>
    </View>
  );
}
