import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import { EntryEditItems } from "@/components/EntryEditItems";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useEditMeal } from "@/context/MealContext";
import { ServingDataNew, servingSchemaNew } from "@/schemas/serving";

export default function DetailsScreen() {
  const { product: productId } = useLocalSearchParams<{ product: string }>();

  const { meal, updateMealProduct, removeMealProduct } = useEditMeal();

  const mealProducts = meal?.meal_product;
  const mealProduct = mealProducts?.find(
    (mealProduct) => mealProduct.product_id === productId,
  );

  const { control, handleSubmit } = useForm<ServingDataNew>({
    resolver: zodResolver(servingSchemaNew),
    defaultValues: {
      quantity: mealProduct?.quantity ?? 0,
    },
  });

  const handleUpdate = async (data: ServingDataNew) => {
    const { quantity } = data;

    updateMealProduct(productId, { quantity });

    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleDelete = () => {
    removeMealProduct(productId);

    if (router.canGoBack()) {
      router.back();
    }
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
        title={mealProduct?.product.title!}
        content={mealProduct?.product.brand!}
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
