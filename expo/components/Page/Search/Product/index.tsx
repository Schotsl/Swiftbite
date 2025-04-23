import { FlatList } from "react-native";
import { useSearch } from "@/hooks/useSearch";
import { useEffect } from "react";
import { ProductSearch } from "@/types";

import Item from "@/components/Item";
import ProductStatus from "@/components/Product/Status";

type PageSearchProps = {
  query: string;

  onSelect: (product: ProductSearch) => void;
};

export default function PageSearchProduct({
  query,
  onSelect,
}: PageSearchProps) {
  const { error, search, loading, products } = useSearch();

  const isEmpty = products.length === 0;
  const isSearchable = query.length > 2;

  useEffect(() => {
    search(query);
  }, [query, search]);

  if (loading) {
    return (
      <ProductStatus status="🕵️ We zijn het hele internet aan het zoeken naar jou product" />
    );
  }

  if (error) {
    return (
      <ProductStatus
        active={false}
        status="😔 Er is iets mis gegaan tijdens het zoeken naar jou product"
      />
    );
  }

  if (isEmpty && isSearchable) {
    return (
      <ProductStatus
        active={false}
        status={"😔 We hebben geen producten gevonden met deze naam"}
      />
    );
  }

  if (!isEmpty && isSearchable) {
    return (
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <Item
              title={item.title}
              subtitle={item.brand}
              rightTop={`${item.quantity_original} ${item.quantity_original_unit}`}
              onPress={() => onSelect(item)}
            />
          );
        }}
      />
    );
  }

  return (
    <ProductStatus
      active={false}
      status={"🥳 Start met zoeken door minimaal twee letters te typen"}
    />
  );
}
