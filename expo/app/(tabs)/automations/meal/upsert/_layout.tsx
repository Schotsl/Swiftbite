import mealData from "@/queries/mealData";

import { useQuery } from "@tanstack/react-query";
import { MealProvider } from "@/context/MealContext";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, Slot } from "expo-router";

import Empty from "@/components/Empty";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import language from "@/language";
import variables from "@/variables";

export default function AutomationsMealUpsertLayout() {
  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();

  const { data, isLoading } = useQuery({
    ...mealData({ uuid: mealId }),
    select: (data) => data[0],
    enabled: !!mealId,
  });

  if (isLoading) {
    return <AutomationsMealUpsertLayoutLoading />;
  }

  return (
    <MealProvider initial={data!}>
      <Slot />
    </MealProvider>
  );
}

function AutomationsMealUpsertLayoutLoading() {
  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title={language.modifications.getEdit(language.types.meal.single)}
            content={language.types.meal.explanation}
          />

          <Empty
            emoji="🔎"
            active={true}
            overlay={true}
            content={language.types.meal.loading}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.modifications.getSave(language.types.meal.single)}
        loading={true}
        disabled={true}
        onPress={() => {}}
      />
    </View>
  );
}
