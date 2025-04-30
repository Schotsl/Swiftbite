import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMeal } from "@/context/MealContext";
import { SwipeListView } from "react-native-swipe-list-view";
import { MealData, mealSchema } from "@/schemas/serving";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputLabel from "@/components/Input/Label";
import ItemDelete from "@/components/Item/Delete";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import ItemProductWithServing from "@/components/Item/ProductWithServing";
import { useEffect } from "react";
import ButtonOverlay from "@/components/Button/Overlay";
import ButtonSmall from "@/components/Button/Small";

export default function DetailsScreen() {
  const router = useRouter();

  const deleteMeal = useDeleteMeal();

  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();
  const { meal, removeMealProduct, updateTitle, saveChanges } = useEditMeal();

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: meal?.title || "",
    },
  });

  // Keep the local context in sync with the form
  const title = watch("title");

  // TODO: I should check this with David since it causes a recursive update
  useEffect(() => {
    updateTitle(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleSave = async () => {
    await saveChanges();

    router.replace("/(tabs)/automations");
  };

  const handleDelete = async () => {
    await deleteMeal.mutateAsync(mealId);

    router.replace("/(tabs)/automations");
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "flex-start",
        backgroundColor: "#fff",
      }}
    >
      <Header
        title="Bewerk maaltijd"
        content="Een maaltijd is een combinatie van producten die je opslaat om later in één keer toe te voegen."
        onDelete={handleDelete}
      />

      <View style={{ gap: 48, width: "100%" }}>
        <View style={{ gap: 32 }}>
          <Input
            name="title"
            control={control}
            label="Titel"
            placeholder="Maaltijd titel"
          />

          <View style={{ gap: 12 }}>
            <View>
              <InputLabel label="Ingrediënten" />

              <SwipeListView
                style={{
                  width: "100%",
                  flexDirection: "column",
                  borderWidth: 2,
                  borderColor: "#000000",
                  borderRadius: 8,
                }}
                data={meal?.meal_product}
                keyExtractor={(item) => item.product_id}
                renderItem={({ item, index }) => {
                  const length = meal?.meal_product.length || 0;
                  const serving = {
                    gram: item.selected_gram!,
                    option: item.selected_option!,
                    quantity: item.selected_quantity!,
                  };

                  return (
                    <ItemProductWithServing
                      icon={false}
                      small={true}
                      border={index !== length - 1}
                      product={item.product}
                      serving={serving}
                      onPress={() => {
                        router.push({
                          pathname: `/(tabs)/automations/meal/[meal]/product`,
                          params: {
                            meal: item.meal_id,
                            product: item.product_id,
                          },
                        });
                      }}
                    />
                  );
                }}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      height: 80,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        opacity: 0.25,
                        maxWidth: 200,
                        textAlign: "center",

                        fontSize: 14,
                        fontWeight: "semibold",
                      }}
                    >
                      Nog geen ingrediënten toegevoegd
                    </Text>
                  </View>
                )}
                renderHiddenItem={({ item, index }) => {
                  const length = meal?.meal_product.length || 0;
                  return (
                    <ItemDelete
                      border={index !== length - 1}
                      onDelete={() => removeMealProduct(item.product_id)}
                    />
                  );
                }}
                onRowDidOpen={(rowKey, rowMap) => {
                  setTimeout(() => {
                    rowMap[rowKey]?.closeRow();
                  }, 500);
                }}
                rightOpenValue={-75}
                useNativeDriver
                disableRightSwipe
              />
            </View>

            <ButtonSmall
              icon="plus"
              onPress={() => {
                router.push(`/(tabs)/automations/meal/${mealId}/search`);
              }}
              title="Ingrediënt toevoegen"
            />
          </View>
        </View>
      </View>

      <ButtonOverlay
        title="Wijzigingen opslaan"
        onPress={handleSubmit(handleSave)}
        disabled={isSubmitting}
        loading={isSubmitting}
      />
    </View>
  );
}
