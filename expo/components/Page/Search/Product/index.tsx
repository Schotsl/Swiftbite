import { Enums } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";

import Item from "@/components/Item";
import ProductStatus from "@/components/Product/Status";
import SearchCollapsable from "@/components/Search/Collapsable";

import productData from "@/queries/productData";

type PageSearchProps = {
  type: Enums<"type">;
  query: string;
  queryWatched: string;
  focused: boolean;

  onSelect: (product: string) => void;
};

export default function PageSearchProduct({
  type,
  query,
  queryWatched,
  focused,
  onSelect,
}: PageSearchProps) {
  const { error, loading, products, overloaded, reset, search } = useSearch();

  const { data: favoriteProducts, isLoading: favoriteProductsLoading } =
    useQuery(productData({ rpc: "product_favorite" }));

  const { data: mostRecentProducts, isLoading: mostRecentProductsLoading } =
    useQuery(productData({ rpc: "product_most_recent" }));

  const { data: mostUsedProducts, isLoading: mostUsedProductsLoading } =
    useQuery(productData({ rpc: "product_most_used" }));

  const isEmpty = products.length === 0;
  const isActive = focused || queryWatched?.length > 0;
  const isSearchable = query.length >= 4;

  useEffect(() => {
    if (isSearchable) {
      search(query, type);
    } else {
      reset();
    }
  }, [query, type]);

  if (loading && isEmpty) {
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

  if (isSearchable) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={products}
          scrollEnabled={false}
          keyExtractor={(item, index) => item.uuid}
          renderItem={({ item }) => {
            return (
              // TODO: This could probably be fixed with a defined type for processing
              <Item
                title={(item.title || item.search?.title)!}
                subtitle={(item.brand || item.search?.brand)!}
                subtitleIcon={item.processing ? "globe" : undefined}
                rightTop={`${item.quantity?.quantity || item.search?.quantity_original} ${item.quantity?.option || item.search?.quantity_original_unit}`}
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </ScrollView>
    );
  }

  if (isActive) {
    return (
      <ProductStatus
        active={false}
        status={
          "🥳 Start met zoeken door minimaal 4 letters te typen en druk op enter"
        }
      />
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
    </View>
  );
}
