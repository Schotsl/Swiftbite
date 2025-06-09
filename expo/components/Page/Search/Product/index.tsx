import { Enums } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/useSearch";
import { useEffect, useState } from "react";
import {
  ScrollView,
  ActivityIndicator,
  FlatList,
  Keyboard,
  View,
} from "react-native";

import variables from "@/variables";
import language from "@/language";
import productData from "@/queries/productData";

import Input from "@/components/Input";
import Empty from "@/components/Empty";
import ItemProduct from "@/components/Item/Product";
import PageSearchProductCollapsable from "@/components/Page/Search/Product/Collapsable";

import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchData, searchSchema } from "@/schemas/search";

type PageSearchProps = {
  type: Enums<"type">;

  onSelect: (product: string) => void;
};

export default function PageSearchProduct({ type, onSelect }: PageSearchProps) {
  const { query, error, loading, products, overloaded, search } = useSearch();

  const { control, watch, handleSubmit } = useForm<SearchData>({
    resolver: zodResolver(searchSchema),
  });

  const queryWatched = watch("query");

  const handleSearch = (data: SearchData) => {
    const { query } = data;

    if (!query) {
      return;
    }

    if (query.length < 4) {
      return;
    }

    search(query, type);
  };

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      if (!queryWatched) {
        return;
      }

      if (queryWatched.length === 0) {
        return;
      }

      // If the query has already been triggered by the submit button we don't need to trigger it again
      if (loading) {
        return;
      }

      search(queryWatched, type);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!queryWatched) {
      return;
    }

    search(queryWatched, type);
  }, [type]);

  const placeholder =
    type === "search_product"
      ? language.search.results.getPlaceholder(language.types.product.single)
      : language.search.results.getPlaceholder(language.types.basic.single);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "column",

          padding: variables.padding.small.horizontal,
          paddingHorizontal: variables.padding.page,

          borderBottomWidth: variables.border.width,
          borderBottomColor: variables.border.color,
        }}
      >
        <Input
          name="query"
          icon="magnifying-glass"
          control={control}
          placeholder={placeholder}
          onSubmit={handleSubmit(handleSearch)}
        />
      </View>

      <PageSearchProductContent
        type={type}
        error={error}
        loading={loading}
        products={products}
        overloaded={overloaded}
        query={query}
        queryWatched={queryWatched}
        onSelect={onSelect}
      />
    </View>
  );
}

type PageSearchProductContentProps = {
  type: Enums<"type">;
  error: boolean;
  loading: boolean;
  products: Product[];
  overloaded: boolean;
  query: string;
  queryWatched?: string;
  onSelect: (product: string) => void;
};

function PageSearchProductContent({
  type,
  loading,
  query,
  queryWatched,
  error,
  overloaded,
  products,
  onSelect,
}: PageSearchProductContentProps) {
  const { data: favoriteProducts, isLoading: favoriteProductsLoading } =
    useQuery(productData({ rpc: "product_favorite", type }));

  const { data: mostRecentProducts, isLoading: mostRecentProductsLoading } =
    useQuery(productData({ rpc: "product_most_recent", type }));

  const { data: mostUsedProducts, isLoading: mostUsedProductsLoading } =
    useQuery(productData({ rpc: "product_most_used", type }));

  const isEmpty = products.length === 0;
  const isPreviewing = queryWatched === query;
  const isSearchable = query?.length >= 4;

  const [opened, setOpened] = useState<string | null>(null);

  const label =
    type === "search_product"
      ? language.types.product.plural
      : language.types.basic.plural;

  const opposite =
    type === "search_product"
      ? language.types.basic.plural
      : language.types.product.plural;

  if (error) {
    return (
      <Empty emoji="⚠️" content={language.search.results.getError(label)} />
    );
  }

  if (overloaded) {
    return <Empty emoji="🥱" content={language.search.results.overloaded} />;
  }

  if (queryWatched === undefined || queryWatched.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <PageSearchProductCollapsable
          title={language.search.favorite.getTitle(label)}
          empty={language.search.favorite.getEmpty(label)}
          emoji="😊"
          opened={opened}
          loading={favoriteProductsLoading}
          products={favoriteProducts}
          onOpen={setOpened}
          onSelect={onSelect}
        />

        <PageSearchProductCollapsable
          title={language.search.manual.getTitle(label)}
          empty={language.search.manual.getEmpty(label)}
          emoji="📝"
          opened={opened}
          loading={false}
          products={[]}
          onOpen={setOpened}
          onSelect={onSelect}
        />

        <PageSearchProductCollapsable
          title={language.search.often.getTitle(label)}
          empty={language.search.often.getEmpty(label)}
          emoji="👀"
          opened={opened}
          loading={mostUsedProductsLoading}
          products={mostUsedProducts}
          onOpen={setOpened}
          onSelect={onSelect}
        />

        <PageSearchProductCollapsable
          title={language.search.recent.getTitle(label)}
          empty={language.search.recent.getEmpty(label)}
          emoji="🆕"
          opened={opened}
          loading={mostRecentProductsLoading}
          products={mostRecentProducts}
          onOpen={setOpened}
          onSelect={onSelect}
        />

        {!opened && (
          <Empty
            emoji={type === "search_product" ? "🥤" : "🍎"}
            content={
              type === "search_product"
                ? language.search.explanation.product
                : language.search.explanation.basic
            }
          />
        )}
      </View>
    );
  }

  if (isEmpty && loading) {
    return (
      <Empty
        emoji="🔎"
        active={true}
        content={language.search.results.getLoading(label)}
      />
    );
  }

  if (isEmpty && isPreviewing && isSearchable) {
    return (
      <Empty
        emoji="😲"
        content={language.search.results.getEmpty(label, opposite)}
        contentSecondary={language.search.results.getAdvice(label)}
      />
    );
  }

  if (!isPreviewing || !isSearchable) {
    return (
      <Empty emoji="🥳" content={language.search.results.getDefault(label)} />
    );
  }

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
