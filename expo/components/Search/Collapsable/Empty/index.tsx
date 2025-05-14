import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";

type SearchCollapsableEmptyProps = {
  empty: string;
};

export default function SearchCollapsableEmpty({
  empty,
}: SearchCollapsableEmptyProps) {
  return (
    <View style={{ minHeight: 180, borderColor: "#000", borderTopWidth: 2 }}>
      <ProductStatus active={false} small={true} status={empty} />
    </View>
  );
}
