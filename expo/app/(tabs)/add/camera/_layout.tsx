import { Slot } from "expo-router";
import { VisionProvider } from "@/context/VisionContext";

export default function AddCameraLayout() {
  return (
    <VisionProvider>
      <Slot />
    </VisionProvider>
  );
}
