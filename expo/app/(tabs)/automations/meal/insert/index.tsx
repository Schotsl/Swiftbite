import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputLabel from "@/components/Input/Label";
import Item from "@/components/Item";
import ItemDelete from "@/components/Item/Delete";
import { Divider } from "@/components/Divider";
import { useEditMeal } from "@/context/MealContext";
import { MealData, mealSchema } from "@/schemas/serving";

export default function InsertMealForm() {
  const router = useRouter();
  const { meal, removeMealProduct, saveChanges } = useEditMeal();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: meal?.title || "",
    },
  });

  const handleSave = async (data: MealData) => {
    await saveChanges();

    router.replace("/(tabs)/automations");
  };

  const handleAddIngredient = () => {
    router.push(`/(tabs)/automations/meal/${meal?.uuid}/product/search`);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "flex-start",
        backgroundColor: "#fff",
        gap: 48,
      }}
    >
      <Header title="Nieuwe maaltijd" />

      <View style={{ width: "100%", gap: 32 }}>
        <Input
          name="title"
          control={control}
          label="Titel"
          placeholder="Maaltijd titel"
          disabled={isSubmitting}
        />

        <View>
          <InputLabel label="Ingrediënten" />
          <SwipeListView
            style={{
              width: "100%",
              flexDirection: "column",
              borderWidth: 2,
              borderColor: "#000000",
              borderRadius: 8,
              minHeight: 50,
            }}
            data={meal?.meal_product || []}
            keyExtractor={(item) => item.product_id}
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
            renderItem={({ item, index }) => {
              const gram = item.selected_gram || 0;
              const calories = item.product.calorie_100g || 0;

              const caloriesCalculated = (calories / 100) * gram;
              const caloriesRounded = Math.round(caloriesCalculated);

              return (
                <Item
                  small
                  key={item.product_id}
                  border={index !== length - 1}
                  title={item.product.title!}
                  subtitle={`${caloriesRounded} kcal`}
                  rightTop={`${gram}g`}
                  onPress={() => {}}
                />
              );
            }}
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

        <View style={{ width: "100%", gap: 24 }}>
          <Button
            title="Voeg ingrediënt toe"
            onPress={handleAddIngredient}
            disabled={isSubmitting}
          />

          <Divider />

          <Button
            title="Maaltijd opslaan"
            onPress={handleSubmit(handleSave)}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </View>
      </View>
    </View>
  );
}
