import Tabs from "@/components/Tabs";

import { View } from "react-native";
import { usePathname } from "expo-router";

export default function Tab() {
  const path = usePathname();

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <Tabs
        value={path}
        tabs={[
          { href: "/automations/meal", title: "Meal" },
          { href: "/automations/automation", title: "Automations" },
        ]}
      />
    </View>
  );
}
