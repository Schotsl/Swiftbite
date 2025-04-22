import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { ProductSearch } from "@/types";
import { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

import Tabs from "@/components/Tabs";
import Item from "@/components/Item";
import Input from "@/components/Input";
import ProductStatus from "@/components/Product/Status";

export default function AddText() {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const focus = useIsFocused();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("producten");

  const { products, loading, error, search } = useSearch();

  const handleInput = (text: string) => {
    setQuery(text);

    timeout.current = setTimeout(() => search(text), 500);
  };

  const handleSelect = (product: ProductSearch) => {
    router.push({
      pathname: "/add/add-product",
      params: {
        title: product.title,
        brand: product.brand,
        quantity_original: product.quantity_original,
        quantity_original_unit: product.quantity_original_unit,
      },
    });
  };

  useEffect(() => {
    if (focus) {
      return;
    }

    setQuery("");

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [focus]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        onSelect={(value) => setSelected(value)}
        value={selected}
        tabs={[
          { value: "producten", title: "Producten" },
          { value: "basisitems", title: "Basisitems" },
          { value: "maaltijden", title: "Maaltijden" },
        ]}
      />
      <View
        style={{
          padding: 16,
          paddingHorizontal: 32,
          borderBottomWidth: 2,
          borderBottomColor: "#000000",
        }}
      >
        <Input
          name="query"
          type="default"
          icon="magnifying-glass"
          value={query}
          placeholder="Search for food..."
          onChange={handleInput}
        />
      </View>

      {loading ? (
        <ProductStatus
          status={
            "🕵️ We zijn het hele internet aan het zoeken naar jou product"
          }
        />
      ) : error ? (
        <ProductStatus
          active={false}
          status={
            "😔 Er is iets mis gegaan tijdens het zoeken naar jou product"
          }
        />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Item
                title={item.title}
                subtitle={item.brand}
                rightTop={`${item.quantity_original} ${item.quantity_original_unit}`}
                onPress={() => handleSelect(item)}
              />
            );
          }}
        />
      ) : (
        <ProductStatus
          active={false}
          status={"🥳 Start met zoeken door minimaal twee letters te typen"}
        />
      )}
    </SafeAreaView>
  );
}
