import Label from "@/components/Label";

import { Image, View } from "react-native";

type EstimationImageProps = {
  image: string;
  width: number;
  height: number;
};

export default function EstimationImage({
  image,
  width,
  height,
}: EstimationImageProps) {
  return (
    <View>
      <Label label="Afbeelding" />

      <Image
        style={{
          height: 100,
          width: "auto",

          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 8,

          aspectRatio: width / height,
        }}
        source={{ uri: image }}
      />
    </View>
  );
}
