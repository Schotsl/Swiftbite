import { Slot } from "expo-router";
import { VisionProvider } from "@/context/VisionContext";

export default function AutomationsRepeatUpsertCameraLayout() {
  return (
    <VisionProvider>
      <Slot />
    </VisionProvider>
  );
}
