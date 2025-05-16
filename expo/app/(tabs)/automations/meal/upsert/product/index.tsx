import productData from "@/queries/productData";
import PageProduct from "@/components/Page/Product";
import ProductStatus from "@/components/Product/Status";
import HeaderLoading from "@/components/Header/Loading";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useEditMeal } from "@/context/MealContext";
import { ServingData } from "@/schemas/serving";
import { Redirect, router, useLocalSearchParams } from "expo-router";

export default function AddPreviewBarcodeScreen() {
  const {
    updateMealProduct,
    insertMealProduct,
    removeMealProduct,
    mealProducts,
  } = useEditMeal();

  const { barcode, product: productId } = useLocalSearchParams<{
    barcode?: string;
    product?: string;
  }>();

  const { data: products, isLoading } = useQuery({
    ...productData({ barcode, uuid: productId }),
  });

  if (isLoading) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const product = products?.[0];

  if (!product) {
    return <Redirect href="/(tabs)/automations/meal" />;
  }

  const mealProduct = mealProducts.find(
    (mealProduct) => mealProduct.product.uuid === productId,
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
          updateMealProduct(product, returnedServing);

          router.replace(`/(tabs)/automations/meal/upsert`);

          return;
        }

        insertMealProduct(product, returnedServing);

        router.replace(`/(tabs)/automations/meal/upsert`);
      }}
    />
  );
}
