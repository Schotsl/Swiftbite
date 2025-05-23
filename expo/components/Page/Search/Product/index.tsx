import { Enums } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";

import ProductStatus from "@/components/Product/Status";
import SearchCollapsable from "@/components/Search/Collapsable";

import productData from "@/queries/productData";
import ItemProduct from "@/components/Item/Product";
import language from "@/language";

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

  const labelPlural = type === "search_product" ? "producten" : "basisitems";

  const [previousQuery, setPreviousQuery] = useState(query);

  useEffect(() => {
    if (isSearchable) {
      // We'll only allow the user to query the same product again if there's a error or overloaded
      if (previousQuery === query && !overloaded && !error) {
        return;
      }

      search(query, type);
      setPreviousQuery(query);

      return;
    }

    reset();
  }, [
    query,
    type,
    isSearchable,
    previousQuery,
    search,
    reset,
    error,
    overloaded,
  ]);

  if (loading && isEmpty) {
    return (
      <ProductStatus status={language.search.results.getLoading(labelPlural)} />
    );
  }

  if (error) {
    return (
      <ProductStatus
        active={false}
        status={language.search.results.getError(labelPlural)}
      />
    );
  }

  if (overloaded) {
    return (
      <ProductStatus
        active={false}
        status={language.search.results.overloaded}
      />
    );
  }

  if (isEmpty && isSearchable) {
    return (
      <ProductStatus
        active={false}
        status={language.search.results.getEmpty(labelPlural)}
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
            <ItemProduct icon={false} product={item} onSelect={onSelect} />
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
        status={language.search.results.getDefault(labelPlural)}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchCollapsable
        title={language.search.favorite.getTitle(labelPlural)}
        empty={language.search.favorite.getEmpty(labelPlural)}
        loading={favoriteProductsLoading}
        products={favoriteProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={language.search.manual.getTitle(labelPlural)}
        empty={language.search.manual.getEmpty(labelPlural)}
        loading={false}
        products={[]}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={language.search.often.getTitle(labelPlural)}
        empty={language.search.often.getEmpty(labelPlural)}
        loading={mostUsedProductsLoading}
        products={mostUsedProducts}
        onSelect={onSelect}
      />

      <SearchCollapsable
        title={language.search.recent.getTitle(labelPlural)}
        empty={language.search.recent.getEmpty(labelPlural)}
        loading={mostRecentProductsLoading}
        products={mostRecentProducts}
        onSelect={onSelect}
      />
    </View>
  );
}
