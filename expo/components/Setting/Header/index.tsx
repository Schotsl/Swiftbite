// HAPPY

import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

import userData from "@/queries/userData";
import useSuspenseQueryFocus from "@/hooks/useSuspenseQueryFocus";

import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";

import SettingHeaderAvatar from "./Avatar";

import language from "@/language";
import variables from "@/variables";

export default function SettingHeader() {
  const { data: user } = useSuspenseQueryFocus(userData());

  return (
    <View
      style={{
        gap: variables.gap.normal,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Suspense fallback={<SettingHeaderLoading />}>
        <SettingHeaderAvatar user={user} />

        <View>
          <TextLarge weight="semibold">
            {user.first_name} {user.last_name}
          </TextLarge>

          <TextSmall>
            {language.page.personal.getSubtitle(user.total)}
          </TextSmall>
        </View>
      </Suspense>
    </View>
  );
}

function SettingHeaderLoading() {
  return (
    <View
      style={{
        width: 48,
        height: 48,

        borderColor: variables.border.color,
        borderWidth: variables.border.width,
        borderRadius: 24,

        alignItems: "center",
        justifyContent: "center",
        backgroundColor: variables.colors.greyLight,
      }}
    >
      <ActivityIndicator
        size="small"
        color={variables.colors.text.primary}
        style={{
          transform: [variables.scale],
        }}
      />
    </View>
  );
}
