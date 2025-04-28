import { VisionProvider } from "@/context/VisionContext";
import { Slot } from "expo-router";

export default function CameraLayout() {
  return (
    <VisionProvider>
      <Slot />
    </VisionProvider>
  );
}
