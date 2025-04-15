import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";

import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import { EntryEditItems } from "@/components/EntryEditItems";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useEditMeal } from "@/context/MealContext";
import { ServingDataNew, servingSchemaNew } from "@/schemas/serving";
import { useQuery } from "@tanstack/react-query";
import openfoodData from "@/queries/openfoodData";
import { Product } from "@/types";

export default function DetailsScreen() {
  const { insertMealProduct } = useEditMeal();
  const {
    meal: mealId,
    title,
    brand,
    barcode,
    quantity,
  } = useLocalSearchParams<{
    meal: string;
    title?: string;
    brand?: string;
    barcode?: string;
    quantity?: string;
  }>();

  const { data, isLoading } = useQuery(
    openfoodData({ barcode, title, brand, quantity })
  );

  const product = data as Product;

  const { control, handleSubmit } = useForm<ServingDataNew>({
    resolver: zodResolver(servingSchemaNew),
    defaultValues: {
      quantity: 0,
    },
  });

  const handleInsert = (data: ServingDataNew) => {
    insertMealProduct(product.uuid, data, product);

    router.replace(`/(tabs)/automations/meal/${mealId}`);
  };

  if (isLoading || !data) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "flex-start",
        backgroundColor: "#fff",
      }}
    >
      <Header small title={product?.title!} content={product.brand!} />

      <View style={{ width: "100%", gap: 48 }}>
        <EntryEditItems
          barcode={product?.openfood_id}
          quantity={`${product?.quantity} ${product?.quantity_unit}`}
        />

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
            title="Ingrediënt toevoegen"
            onPress={handleSubmit(handleInsert)}
          />
        </View>
      </View>
    </View>
  );
}
