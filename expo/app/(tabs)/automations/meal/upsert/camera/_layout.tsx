import { Slot } from "expo-router";
import { VisionProvider } from "@/context/VisionContext";

export default function AutomationsMealUpsertCameraLayout() {
  return (
    <VisionProvider>
      <Slot />
    </VisionProvider>
  );
}
