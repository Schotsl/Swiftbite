import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

type IconProps = {
  iconId: string | null;
};

export default function Icon({ iconId }: IconProps) {
  const [loadedImage, setLoadedImage] = useState(false);

  return (
    <View
      style={{
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={`https://ffbbrrfdghbvuajheulg.supabase.co/storage/v1/object/public/icon/${iconId}-256`}
        onLoad={() => setLoadedImage(true)}
        contentFit="contain"
        contentPosition="center"
        style={{
          width: 42,
          zIndex: 1,
          height: 42,
          position: "absolute",
        }}
      />

      <View
        style={{
          width: 42,
          height: 42,
          position: "absolute",

          borderRadius: 42,
          borderWidth: 2,
          borderColor: "#000000",
        }}
      />

      {!loadedImage && <ActivityIndicator size="small" />}
    </View>
  );
}
