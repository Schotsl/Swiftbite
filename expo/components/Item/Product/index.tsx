import Item from "@/components/Item";

import { Product } from "@/types";

type ItemProductProps = {
  border?: boolean;
  product: Product;
  onSelect: (product: string) => void;
};

export default function ItemProduct({
  border = true,
  product,
  onSelect,
}: ItemProductProps) {
  return (
    <Item
      title={product.title || "Loading..."}
      border={border}
      subtitle={product.brand || "Loading..."}
      rightTop={`${product.quantity?.quantity} ${product.quantity?.option}`}
      onPress={() => onSelect(product.uuid)}
    />
  );
}
