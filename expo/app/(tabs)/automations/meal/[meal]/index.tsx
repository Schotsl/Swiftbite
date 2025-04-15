import { View } from "react-native";
import { Divider } from "@/components/Divider";
import { useRouter } from "expo-router";
import { useEditMeal } from "@/context/MealContext";
import { SwipeListView } from "react-native-swipe-list-view";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Item from "@/components/Item";
import ItemDelete from "@/components/ItemDelete";

export default function DetailsScreen() {
  const router = useRouter();

  const { meal, removeMealProduct, saveChanges } = useEditMeal();

  const handleSaveChanges = async () => {
    await saveChanges();

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
      <Header title="Bewerk maaltijd" />

      <View style={{ gap: 48, width: "100%" }}>
        <View style={{ gap: 32 }}>
          <Input
            name="title"
            value={meal?.title}
            label="Titel"
            placeholder="Maaltijd titel"
          />

          <View>
            <Label label="Ingrediënten" />

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

                const quantity = item.quantity || 0;
                const multiplier = item.product.calorie_100g || 0;

                const calories = (multiplier / 100) * quantity;
                const caloriesRounded = Math.round(calories);

                return (
                  <Item
                    small
                    key={item.product_id}
                    href={`/(tabs)/automations/meal/${item.meal_id}/product/${item.product_id}`}
                    border={index !== length - 1}
                    title={item.product.title!}
                    subtitle={`${caloriesRounded} kcal`}
                    rightTop={`1 kom (100g)`}
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

          <View style={{ gap: 24 }}>
            <Button title="Voeg ingrediënt toe" onPress={() => {}} />

            <Button title="Wijzigingen opslaan" onPress={handleSaveChanges} />

            <Divider />

            <Button
              title="Verwijder maaltijd"
              action="delete"
              // onPress={() => handleMealDelete(data!.uuid)}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
