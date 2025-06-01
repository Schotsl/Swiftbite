import { Image, TouchableOpacity, View } from "react-native";

import variables from "@/variables";
import language from "@/language";

import TextInput from "@/components/Text/Input";
import InputLabel from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

type EstimationImageProps = {
  required?: boolean;
  image: {
    uri: string;
    width: number;
    height: number;
  } | null;

  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function EstimationImage({
  image,
  required = true,

  onAdd,
  onEdit,
  onDelete,
}: EstimationImageProps) {
  // I honestly don't know why this works but I'm really struggling with the react-native-vision-camera aspect ratio but it works
  const imageAspect = image
    ? image.height < image.width
      ? image.height / image.width
      : image.width / image.height
    : 1;

  const imageAspectCapped = Math.max(imageAspect, 4 / 5);

  return (
    <View>
      <InputLabel label={language.input.image.title} required={required} />

      {image ? (
        <View
          style={{
            width: imageAspectCapped * 150,
            height: 150,
            position: "relative",

            overflow: "hidden",
            borderColor: variables.border.color,
            borderWidth: variables.border.width,
            borderRadius: variables.border.radius,
          }}
        >
          <View
            style={{
              top: 12,
              left: 12,
              right: 12,
              zIndex: 1,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ButtonSmall
              nano={true}
              icon="pencil"
              action="tertiary"
              onPress={onEdit}
            />

            <ButtonSmall
              nano={true}
              icon="xmark"
              action="tertiary"
              onPress={onDelete}
            />
          </View>

          <Image
            source={{ uri: image.uri }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={onAdd}>
          <View
            style={{
              flex: 1,
              marginTop: -4,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput>{language.input.image.empty}</TextInput>

            <ButtonSmall nano={true} icon="pencil" onPress={onAdd} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
