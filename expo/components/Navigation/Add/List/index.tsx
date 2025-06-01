// HAPPY

import { Href, useRouter } from "expo-router";
import { useCameraPermission } from "react-native-vision-camera";
import { Alert, StyleProp, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import variables from "@/variables";
import language from "@/language";

type NavigationAddListProps = {
  camera: Href;
  search: Href;
  estimation?: Href;

  style?: StyleProp<ViewStyle>;

  onClose: () => void;
};

export default function NavigationAddList({
  camera,
  search,
  estimation,

  style,
  onClose,
}: NavigationAddListProps) {
  const router = useRouter();

  const { hasPermission, requestPermission } = useCameraPermission();

  const handleSearch = () => {
    onClose();

    router.push(search);
  };

  const handleEstimate = () => {
    onClose();

    router.push(estimation!);
  };

  const handleCamera = async () => {
    // Ask for camera permissions if not granted
    if (!hasPermission) {
      const response = await requestPermission();

      if (!response) {
        Alert.alert(
          language.alert.permission.title,
          language.alert.permission.subtitle
        );

        return;
      }
    }

    onClose();

    router.push(camera);
  };

  return (
    <View
      style={[
        {
          gap: variables.gap.normal,
          left: "50%",
          width: 200,
          bottom: 110,
          position: "absolute",
          transform: [{ translateX: -100 }],
        },
        style,
      ]}
    >
      {camera && (
        <Button
          icon="camera"
          title={language.navigation.add.camera}
          action="tertiary"
          onPress={handleCamera}
        />
      )}

      {search && (
        <Button
          icon="magnifying-glass"
          title={language.navigation.add.search}
          action="tertiary"
          onPress={handleSearch}
        />
      )}

      {estimation && (
        <Button
          icon="wand-magic-sparkles"
          title={language.navigation.add.estimation}
          action="tertiary"
          onPress={handleEstimate}
        />
      )}
    </View>
  );
}
