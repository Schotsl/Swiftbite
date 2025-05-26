import PageProduct from "@/components/Page/Product";
import PageProductLoading from "@/components/Page/Product/Loading";

import { useQuery } from "@tanstack/react-query";
import { useProduct } from "@/hooks/useProduct";
import { useEditMeal } from "@/context/MealContext";
import { ServingData } from "@/schemas/serving";
import { useLocalSearchParams, Redirect, router } from "expo-router";

import userData from "@/queries/userData";

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

  const { data: user, isLoading: isLoadingUser } = useQuery(userData());
  const { product, isLoading: isLoadingProduct } = useProduct({
    productId,
    barcodeId,
    enabled: !!productId || !!barcodeId,
    redirect: {
      label: "/(tabs)/automations/meal/upsert/camera",
      cancel: "/(tabs)/automations/meal/upsert",
      search: "/(tabs)/automations/meal/upsert/search",
    },
  });

  const mealProduct = mealProducts.find(
    (mealProduct) => mealProduct.product.uuid === productId
  );

  if (isLoadingProduct || isLoadingUser) {
    return <PageProductLoading editing={!!mealProduct?.serving} />;
  }

  if (!product || !user) {
    return <Redirect href="/(tabs)/automations/meal" />;
  }

  return (
    <PageProduct
      user={user}
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
