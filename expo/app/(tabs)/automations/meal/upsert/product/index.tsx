import PageProduct from "@/components/Page/Product";

import { Product } from "@/types";
import { useEditMeal } from "@/context/MealContext";

import { Redirect, router, useLocalSearchParams } from "expo-router";
import ProductStatus from "@/components/Product/Status";
import { useQuery } from "@tanstack/react-query";
import productData from "@/queries/productData";
import { View } from "react-native";
import HeaderLoading from "@/components/Header/Loading";
import { ServingData } from "@/schemas/serving";
import openfoodData from "@/queries/openfoodData";

export default function AddPreviewBarcodeScreen() {
  const {
    updateMealProduct,
    insertMealProduct,
    removeMealProduct,
    mealProducts,
  } = useEditMeal();

  const {
    title,
    brand,
    barcode,
    product: productId,
  } = useLocalSearchParams<{
    title?: string;
    brand?: string;
    barcode?: string;
    product?: string;
  }>();

  const { data: productEdit, isLoading: isLoadingEdit } = useQuery({
    ...productData({}),
    select: (data) => data.find((product) => product.uuid === productId),
    enabled: !!productId,
  });

  const { data: productOpenfood, isLoading: isLoadingOpenfood } = useQuery({
    ...openfoodData({
      title,
      brand,
      barcode,
    }),
    enabled: !productId,
  });

  if (isLoadingEdit || isLoadingOpenfood) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const product = productEdit || productOpenfood;

  if (!product) {
    return <Redirect href="/(tabs)/automations/meal" />;
  }

  const mealProduct = mealProducts.find(
    (mealProduct) => mealProduct.product_id === productId,
  );

  return (
    <PageProduct
      product={product}
      serving={mealProduct?.serving}
      onDelete={() => {
        removeMealProduct(productId!);

        router.replace(`/(tabs)/automations/meal/upsert`);
      }}
      onSave={async (returnedServing: ServingData) => {
        if (mealProduct?.serving) {
          updateMealProduct(productId!, returnedServing);

          router.replace(`/(tabs)/automations/meal/upsert`);

          return;
        }

        insertMealProduct(product.uuid, returnedServing);

        router.replace(`/(tabs)/automations/meal/upsert`);
      }}
    />
  );
}
