import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ServingData } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { FlatList, View } from "react-native";
import { MealWithProduct, Meal } from "@/types/meal";
import { SearchData, searchSchema } from "@/schemas/search";

import language from "@/language";
import variables from "@/variables";

import mealData from "@/queries/mealData";

import Empty from "@/components/Empty";
import Input from "@/components/Input";
import ItemMeal from "@/components/Item/Meal";

type PageSearchProps = {
  onSelect: (meal: string, serving: ServingData) => void;
};

export default function PageSearchMeal({ onSelect }: PageSearchProps) {
  const focus = useIsFocused();

  const { control, watch } = useForm<SearchData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const query = watch("query");

  const filter = (meal: Meal) => {
    if (!query || query.length === 0) {
      return true;
    }
    const lowerQuery = query.toLowerCase();
    const lowerTitle = meal.title.toLowerCase();

    return lowerTitle.includes(lowerQuery);
  };

  const { data, isError, isLoading } = useQuery({
    ...mealData({}),
    select: (data) => data?.filter(filter),
    enabled: focus,
  });

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
          placeholder={language.search.results.getPlaceholder(
            language.types.meal.single,
          )}
        />
      </View>

      <PageSearchMealContent
        query={query}
        meals={data ?? []}
        error={isError}
        loading={isLoading}
        onSelect={onSelect}
      />
    </View>
  );
}

type PageSearchMealContentProps = {
  query?: string;
  meals: MealWithProduct[];
  error: boolean;
  loading: boolean;
  onSelect: (meal: string, serving: ServingData) => void;
};

function PageSearchMealContent({
  query,
  meals,
  loading,
  error,
  onSelect,
}: PageSearchMealContentProps) {
  const label = language.types.meal.plural;
  const router = useRouter();

  const isEmpty = meals?.length === 0;

  if (loading) {
    return (
      <Empty
        emoji="🔎"
        active={true}
        content={language.types.meal.loadingPlural}
      />
    );
  }

  if (error) {
    return (
      <Empty emoji="⚠️" content={language.search.results.getError(label)} />
    );
  }

  if (isEmpty && !query) {
    return (
      <Empty
        emoji="🍲"
        content={language.search.explanation.meal}
        button={{
          icon: "plus",
          title: language.modifications.getInsert(language.types.meal.single),
          onPress: () => {
            router.push({
              pathname: `/(tabs)/automations/meal/upsert`,
            });
          },
        }}
      />
    );
  }

  if (isEmpty) {
    return (
      <Empty emoji="😲" content={language.search.results.getEmpty(label)} />
    );
  }

  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => {
        const handleSelect = (uuid: string) => {
          onSelect(uuid, {
            gram: item.quantity_gram,
            option: "meal",
            quantity: 1,
          });
        };

        return <ItemMeal meal={item} onSelect={handleSelect} />;
      }}
    />
  );
}
