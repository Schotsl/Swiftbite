import ItemSkeleton from "@/components/Item/Skeleton";

import { FlatList } from "react-native";

export default function SearchCollapsableSkeleton() {
  return (
    <FlatList
      data={[1, 2, 3]}
      style={{ borderColor: "#000", borderTopWidth: 2 }}
      renderItem={({ item, index }) => (
        <ItemSkeleton border={index !== 2} key={index} />
      )}
    />
  );
}
