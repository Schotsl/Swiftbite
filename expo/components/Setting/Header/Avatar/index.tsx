import { User } from "@/types/user";
import { Image } from "expo-image";
import { ActivityIndicator, View } from "react-native";

import Gravatar from "@krosben/react-native-gravatar";

import variables from "@/variables";

type SettingHeaderAvatarProps = {
  user: User;
};

export default function SettingHeaderAvatar({
  user: { email },
}: SettingHeaderAvatarProps) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        overflow: "hidden",
        position: "relative",

        borderColor: variables.border.color,
        borderWidth: variables.border.width,
        borderRadius: 24,
      }}
    >
      {email ? (
        <View
          style={{
            width: 45,
            height: 45,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Gravatar email={email} size={88} />

          <View
            style={{
              width: 45,
              height: 45,
              zIndex: -1,

              position: "absolute",
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
        </View>
      ) : (
        <Image
          style={{ width: 45, height: 45, zIndex: -1, position: "absolute" }}
          source={require("@/assets/images/placeholder.svg")}
          contentFit="contain"
          contentPosition="center"
        />
      )}
    </View>
  );
}
