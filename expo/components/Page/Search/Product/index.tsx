import { Enums } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";

import ProductStatus from "@/components/Product/Status";
import SearchCollapsable from "@/components/Search/Collapsable";

import productData from "@/queries/productData";
import ItemProduct from "@/components/Item/Product";

type PageSearchProps = {
  type: Enums<"type">;
  query: string;
  queryWatched: string;

  onSelect: (product: string) => void;
};

export default function PageSearchProduct({
  type,
  query,
  queryWatched,
  onSelect,
}: PageSearchProps) {
  const { error, loading, products, overloaded, reset, search } = useSearch();

  const { data: favoriteProducts, isLoading: favoriteProductsLoading } =
    useQuery(productData({ rpc: "product_favorite", type }));

  const { data: mostRecentProducts, isLoading: mostRecentProductsLoading } =
    useQuery(productData({ rpc: "product_most_recent", type }));

  const { data: mostUsedProducts, isLoading: mostUsedProductsLoading } =
    useQuery(productData({ rpc: "product_most_used", type }));

  const isEmpty = products.length === 0;
  const isActive = queryWatched?.length > 0;
  const isSearchable = query.length >= 4;

  const labelSingular = type === "search_product" ? "product" : "basisitem";
  const labelPlural = type === "search_product" ? "producten" : "basisitems";

  useEffect(() => {
    if (isSearchable) {
      search(query, type);
    } else {
      reset();
    }
  }, [query, type]);

  if (loading && isEmpty) {
    return (
      <ProductStatus
        status={`🕵️ We zijn het hele internet aan het zoeken naar ${labelPlural}`}
      />
    );
  }

  if (error) {
    return (
      <ProductStatus
        active={false}
        status={`😔 Er is iets mis gegaan tijdens het zoeken naar ${labelPlural}`}
      />
    );
  }

  if (overloaded) {
    return (
      <ProductStatus
        active={false}
        status={`😲 Je hebt je dagelijkse zoek limiet overschreden`}
      />
    );
  }

  if (isEmpty && isSearchable) {
    return (
      <ProductStatus
        active={false}
        status={`😔 We hebben geen ${labelPlural} gevonden met deze naam`}
      />
    );
  }

  if (isSearchable) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={products}
          scrollEnabled={false}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <ItemProduct product={item} onSelect={onSelect} />
          )}
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
        status={`🥳 Start met zoeken door minimaal 4 letters te typen en druk op enter`}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchCollapsable
        title={`Mijn favoriete ${labelPlural}`}
        empty={`😲 Je hebt nog geen ${labelSingular} als favoriet ingesteld`}
        loading={favoriteProductsLoading}
        products={favoriteProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={`Zelf toegevoegde ${labelPlural}`}
        empty={`😲 Je hebt nog geen ${labelPlural} zelf toegevoegd`}
        loading={false}
        products={[]}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={`Vaak gebruikte ${labelPlural}`}
        empty={`😲 Je hebt nog geen ${labelPlural} vaak gebruikt`}
        loading={mostUsedProductsLoading}
        products={mostUsedProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={`Recent gebruikte ${labelPlural}`}
        empty={`😲 Je hebt nog geen ${labelPlural} gebruikt`}
        loading={mostRecentProductsLoading}
        products={mostRecentProducts}
        onSelect={onSelect}
      />
    </View>
  );
}
