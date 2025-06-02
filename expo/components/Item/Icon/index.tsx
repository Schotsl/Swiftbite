// HAPPY

import variables from "@/variables";

import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type ItemIconProps = {
  iconId: string | null;
};

export default function ItemIcon({ iconId }: ItemIconProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [iconId]);

  return (
    <View
      style={{
        width: 38,
        height: 38,
        alignItems: "center",
        borderRadius: 38,
        justifyContent: "center",
        backgroundColor: variables.colors.grey,
      }}
    >
      {iconId && (
        <Image
          source={`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icon/${iconId}-256`}
          onLoad={() => setLoaded(true)}
          contentFit="contain"
          contentPosition="center"
          style={{
            width: 52,
            zIndex: 1,
            height: 52,
            position: "absolute",
          }}
        />
      )}

      {!loaded && (
        <ActivityIndicator
          size="small"
          style={{ transform: [variables.scale] }}
        />
      )}
    </View>
  );
}
