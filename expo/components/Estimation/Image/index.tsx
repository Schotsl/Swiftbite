import Label from "@/components/Label";
import EstimationImageButton from "./Button";

import { Image as ImageType } from "@/types";
import { Image, Text, View } from "react-native";

type EstimationImageProps = {
  image: ImageType | null;
  required?: boolean;

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
  return (
    <View>
      <Label label="Afbeelding" required={required} />

      {image ? (
        <View
          style={{
            width: "auto",
            height: 150,
            position: "relative",

            borderWidth: 2,
            borderColor: "#000",
            borderRadius: 8,

            aspectRatio: image.width / image.height,
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
            <EstimationImageButton icon="pencil" onPress={onEdit} />

            <EstimationImageButton icon="xmark" onPress={onDelete} />
          </View>

          <Image
            source={{ uri: image.uri }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: -4,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontFamily: "OpenSans_600SemiBold",
            }}
          >
            Geen afbeelding
          </Text>

          <EstimationImageButton icon="plus" onPress={onAdd} />
        </View>
      )}
    </View>
  );
}
