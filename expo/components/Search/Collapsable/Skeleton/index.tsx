import ItemSkeleton from "@/components/Item/Skeleton";

import { View } from "react-native";

export default function SearchCollapsableSkeleton() {
  return (
    <View style={{ borderColor: "#000", borderTopWidth: 2 }}>
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}
