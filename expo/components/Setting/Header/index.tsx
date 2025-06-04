import { Fragment, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

import userData from "@/queries/userData";
import useSuspenseQueryFocus from "@/hooks/useSuspenseQueryFocus";

import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";

import SettingHeaderAvatar from "./Avatar";

import language from "@/language";
import variables from "@/variables";

export default function SettingHeader() {
  return (
    <View
      style={{
        gap: variables.gap.normal,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Suspense fallback={<SettingHeaderLoading />}>
        <SettingHeaderContent />
      </Suspense>
    </View>
  );
}

function SettingHeaderContent() {
  const { data: user } = useSuspenseQueryFocus(userData());

  return (
    <Fragment>
      <SettingHeaderAvatar user={user} />

      <View>
        <TextLarge weight="semibold">
          {user.first_name} {user.last_name}
        </TextLarge>

        <TextSmall>{language.page.personal.getSubtitle(user.total)}</TextSmall>
      </View>
    </Fragment>
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
        backgroundColor: variables.colors.grey,
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
