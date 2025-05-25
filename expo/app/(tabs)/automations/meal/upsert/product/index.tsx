import Empty from "@/components/Empty";
import PageProduct from "@/components/Page/Product";
import HeaderLoading from "@/components/Header/Loading";

import { View } from "react-native";
import { useProduct } from "@/hooks/useProduct";
import { useEditMeal } from "@/context/MealContext";
import { ServingData } from "@/schemas/serving";
import { useLocalSearchParams, Redirect, router } from "expo-router";

import language from "@/language";

export default function AutomationsMealUpsertProduct() {
  const {
    updateMealProduct,
    insertMealProduct,
    removeMealProduct,
    mealProducts,
  } = useEditMeal();

  const { barcode: barcodeId, product: productId } = useLocalSearchParams<{
    barcode?: string;
    product?: string;
  }>();

  const { product, isLoading } = useProduct({
    productId,
    barcodeId,
    enabled: !!productId || !!barcodeId,
    redirect: "/(tabs)/automations/meal/upsert/search",
  });

  if (isLoading) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <Empty
          emoji="🔎"
          active={true}
          content={language.types.product.loading}
        />
      </View>
    );
  }

  if (!product) {
    return <Redirect href="/(tabs)/automations/meal" />;
  }

  const mealProduct = mealProducts.find(
    (mealProduct) => mealProduct.product.uuid === productId
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
