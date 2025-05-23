import { Image } from "expo-image";
import { handleError } from "@/helper";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import Gravatar from "@krosben/react-native-gravatar";
import supabase from "@/utils/supabase";
import variables from "@/variables";

export default function SettingHeaderAvatar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      const { data, error } = await supabase.auth.getUser();

      handleError(error);

      const email = data.user?.email;

      if (!email) {
        return;
      }

      setEmail(email);
    };

    loadEmail();
  }, []);

  return (
    <View
      style={{
        width: 48,
        height: 48,
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
              borderRadius: 24,

              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#DDD",
            }}
          >
            <ActivityIndicator size="small" color="#000" />
          </View>
        </View>
      ) : (
        <Image
          style={{ width: 44, height: 44, zIndex: -1, position: "absolute" }}
          source={require("@/assets/images/placeholder.svg")}
          contentFit="contain"
          contentPosition="center"
        />
      )}
    </View>
  );
}
