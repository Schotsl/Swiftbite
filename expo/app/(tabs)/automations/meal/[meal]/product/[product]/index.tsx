import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import { EntryEditItems } from "@/components/EntryEditItems";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useEditMeal } from "@/context/EditMealContext";
import { ServingDataNew, servingSchemaNew } from "@/schemas/serving";

export default function DetailsScreen() {
  const { meal: mealId, product: productId } = useLocalSearchParams<{
    meal: string;
    product: string;
  }>();

  const { meal, updateIngredientQuantity, removeIngredient } = useEditMeal();

  const products = meal?.meal_product;
  const productItem = products?.find(
    (product) => product.product_id === productId
  );

  const { control, handleSubmit } = useForm<ServingDataNew>({
    resolver: zodResolver(servingSchemaNew),
    defaultValues: {
      quantity: productItem?.quantity ?? 0,
    },
  });

  const handleUpdate = async (data: ServingDataNew) => {
    const { quantity } = data;

    updateIngredientQuantity(productId, quantity);

    router.replace(`/(tabs)/automations/meal/${mealId}`);
  };

  const handleDelete = () => {
    removeIngredient(productId);

    router.replace(`/(tabs)/automations/meal/${mealId}`);
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
        small
        title={productItem?.product.title!}
        content={productItem?.product.brand!}
      />

      <View style={{ width: "100%", gap: 48 }}>
        <EntryEditItems barcode="8710400418023" quantity="200 ml" />

        <View style={{ width: "100%", gap: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "semibold" }}>Portie</Text>

          <Input
            name="portie"
            value="1 gram"
            label="Portie grote"
            disabled={true}
            placeholder="1 gram"
          />

          <Input
            name="quantity"
            label="Portie aantal"
            control={control}
            placeholder="100"
          />
        </View>

        <View style={{ gap: 24 }}>
          <Button
            title="Ingrediënt bijwerken"
            onPress={handleSubmit(handleUpdate)}
          />

          <Divider />

          <Button
            title="Ingrediënt verwijderen"
            action="delete"
            onPress={handleDelete}
          />
        </View>
      </View>
    </View>
  );
}
