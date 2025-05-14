import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";

import productData from "@/queries/productData";

import Item from "@/components/Item";
import ProductStatus from "@/components/Product/Status";
import SearchCollapsable from "@/components/Search/Collapsable";

type PageSearchProps = {
  query: string;

  onSelect: (product: string) => void;
};

export default function PageSearchProduct({
  query,

  onSelect,
}: PageSearchProps) {
  const { error, search, loading, products, overloaded } = useSearch();

  const { data: favoriteProducts, isLoading: favoriteProductsLoading } =
    useQuery(productData({ rpc: "product_favorite" }));

  const { data: mostRecentProducts, isLoading: mostRecentProductsLoading } =
    useQuery(productData({ rpc: "product_most_recent" }));

  const { data: mostUsedProducts, isLoading: mostUsedProductsLoading } =
    useQuery(productData({ rpc: "product_most_used" }));

  const isEmpty = products.length === 0;
  const isSearchable = query.length >= 4;

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

  if (overloaded) {
    return (
      <ProductStatus
        active={false}
        status="😲 Je hebt je dagelijkse zoek limiet overschreden"
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
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          scrollEnabled={false}
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Item
                title={item.title}
                subtitle={item.brand}
                subtitleIcon={item.new ? "globe" : undefined}
                rightTop={`${item.quantity_original} ${item.quantity_original_unit}`}
                onPress={() => onSelect(item.uuid)}
              />
            );
          }}
        />

        {loading && (
          <View
            style={{
              width: "100%",
              padding: 32,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchCollapsable
        title="Mijn favoriete producten"
        empty="😲 Je hebt nog geen maaltijden als favoriet ingesteld"
        loading={favoriteProductsLoading}
        products={favoriteProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title="Zelf toegevoegde producten"
        empty="😲 Je hebt nog geen producten zelf toegevoegd"
        loading={false}
        products={[]}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title="Vaak gebruikte producten"
        empty="😲 Je hebt nog geen vaak gebruikte producten"
        loading={mostUsedProductsLoading}
        products={mostUsedProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title="Recent gebruikte producten"
        empty="😲 Je hebt nog geen recent gebruikte producten"
        loading={mostRecentProductsLoading}
        products={mostRecentProducts}
        onSelect={onSelect}
      />

      <ProductStatus
        active={false}
        status={"🥳 Start met zoeken door minimaal 4 letters te typen"}
      />
    </View>
  );
}
