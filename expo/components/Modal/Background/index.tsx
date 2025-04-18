import { TouchableOpacity } from "react-native";

type ModalBackgroundProps = {
  onPress: () => void;
};

export default function ModalBackground({ onPress }: ModalBackgroundProps) {
  return (
    <TouchableOpacity
      style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      onPress={onPress}
      activeOpacity={1}
    />
  );
}
