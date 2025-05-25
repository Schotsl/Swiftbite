import { Enums } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import language from "@/language";
import productData from "@/queries/productData";

import ItemProduct from "@/components/Item/Product";
import Empty from "@/components/Empty";
import PageSearchProductCollapsable from "@/components/Page/Search/Product/Collapsable";
import variables from "@/variables";

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

  const isTyping = queryWatched !== query && queryWatched?.length > 0;
  const isEmpty = products.length === 0;
  const isActive = queryWatched?.length > 0;
  const isSearchable = query.length >= 4;

  const labelPlural =
    type === "search_product"
      ? language.types.product.plural
      : language.types.basic.plural;

  const [opened, setOpened] = useState<string | null>(null);

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
      <Empty
        emoji="🔎"
        active={true}
        content={language.search.results.getLoading(labelPlural)}
      />
    );
  }

  if (error) {
    return (
      <Empty
        emoji="⚠️"
        content={language.search.results.getError(labelPlural)}
      />
    );
  }

  if (overloaded) {
    return <Empty emoji="🥱" content={language.search.results.overloaded} />;
  }

  if (isTyping) {
    return (
      <Empty
        emoji="🥳"
        content={language.search.results.getDefault(labelPlural)}
      />
    );
  }

  if (isEmpty && isSearchable) {
    return (
      <Empty
        emoji="😲"
        content={language.search.results.getEmpty(labelPlural)}
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
            <ActivityIndicator
              size="small"
              color={variables.colors.text.primary}
            />
          </View>
        )}
      </ScrollView>
    );
  }

  if (isActive) {
    return (
      <Empty
        emoji="🥳"
        content={language.search.results.getDefault(labelPlural)}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageSearchProductCollapsable
        title={language.search.favorite.getTitle(labelPlural)}
        empty={language.search.favorite.getEmpty(labelPlural)}
        emoji="😊"
        opened={opened}
        loading={favoriteProductsLoading}
        products={favoriteProducts}
        onOpen={setOpened}
        onSelect={onSelect}
      />

      <PageSearchProductCollapsable
        title={language.search.manual.getTitle(labelPlural)}
        empty={language.search.manual.getEmpty(labelPlural)}
        emoji="📝"
        opened={opened}
        loading={false}
        products={[]}
        onOpen={setOpened}
        onSelect={onSelect}
      />

      <PageSearchProductCollapsable
        title={language.search.often.getTitle(labelPlural)}
        empty={language.search.often.getEmpty(labelPlural)}
        emoji="👀"
        opened={opened}
        loading={mostUsedProductsLoading}
        products={mostUsedProducts}
        onOpen={setOpened}
        onSelect={onSelect}
      />

      <PageSearchProductCollapsable
        title={language.search.recent.getTitle(labelPlural)}
        empty={language.search.recent.getEmpty(labelPlural)}
        emoji="🆕"
        opened={opened}
        loading={mostRecentProductsLoading}
        products={mostRecentProducts}
        onOpen={setOpened}
        onSelect={onSelect}
      />
    </View>
  );
}
