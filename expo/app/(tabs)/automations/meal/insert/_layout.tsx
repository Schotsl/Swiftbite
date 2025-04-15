import { MealProvider } from "@/context/MealContext";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <MealProvider>
      <Slot />
    </MealProvider>
  );
}
