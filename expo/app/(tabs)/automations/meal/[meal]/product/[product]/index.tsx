import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import { EntryEditItems } from "@/components/EntryEditItems";
import Header from "@/components/Header";
import Input from "@/components/Input";
import useUpdateMealProduct from "@/mutations/useUpdateMealProduct";
import mealData from "@/queries/mealData";
import { ServingDataNew, servingSchemaNew } from "@/schemas/serving";

export default function DetailsScreen() {
  const updateMealProduct = useUpdateMealProduct();

  const { meal: mealId, product: productId } = useLocalSearchParams();
  const { data: mealItems } = useSuspenseQuery({
    ...mealData(),
    select: (data) => data.find((meal) => meal.uuid === mealId),
  });

  // TODO: I could probably use a new query to get this specific data
  const productItem = mealItems?.meal_product.find(
    (product) => product.product_id === productId,
  )!;

  const { control, handleSubmit, setValue } = useForm<ServingDataNew>({
    resolver: zodResolver(servingSchemaNew),
  });

  // TODO: This is less than ideal but it's a quick fix to get the form to work
  useEffect(() => {
    if (!productItem) return;

    setValue("quantity", productItem.quantity ?? 0);
  }, [productItem, setValue]);

  const handleUpdate = async (data: ServingDataNew) => {
    const { quantity } = data;
    const object = {
      ...productItem,
      quantity,
    };

    await updateMealProduct.mutateAsync(object);

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
            loading={updateMealProduct.isPending}
            disabled={updateMealProduct.isPending}
          />

          <Divider />

          <Button
            title="Ingrediënt verwijderen"
            action="delete"
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
}
