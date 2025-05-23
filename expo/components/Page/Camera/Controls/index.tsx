import { View } from "react-native";

import CameraControlsCircle from "./Circle";
import CameraControlsSquare from "./Square";

type CameraControlsProps = {
  onFlip: () => void;
  onTake: () => void;
  onDocument: () => void;
};

export default function CameraControls({
  onFlip,
  onTake,
  onDocument,
}: CameraControlsProps) {
  return (
    <View
      style={{
        gap: 42,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <CameraControlsSquare icon="repeat" onPress={onFlip} />

      <CameraControlsCircle onPress={onTake} />

      <CameraControlsSquare icon="images" onPress={onDocument} />
    </View>
  );
}
