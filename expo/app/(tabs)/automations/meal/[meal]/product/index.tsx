import PageProduct from "@/components/Page/Product";

import { Product } from "@/types";
import { useEditMeal } from "@/context/MealContext";

import { router, useLocalSearchParams } from "expo-router";

export default function AddPreviewBarcodeScreen() {
  const { meal, updateMealProduct, insertMealProduct, removeMealProduct } =
    useEditMeal();

  const { meal: mealId, product: productId } = useLocalSearchParams<{
    meal: string;
    product?: string;
  }>();

  const mealProducts = meal?.meal_product;
  const mealProduct = mealProducts?.find(
    (mealProduct) => mealProduct.product_id === productId,
  );

  const product = mealProduct?.product;
  const serving = mealProduct
    ? {
        gram: mealProduct?.selected_gram!,
        option: mealProduct?.selected_option!,
        quantity: mealProduct?.selected_quantity!,
      }
    : undefined;

  return (
    <PageProduct
      product={product}
      serving={serving}
      onDelete={() => {
        removeMealProduct(productId!);

        router.replace(`/(tabs)/automations/meal/${mealId}`);
      }}
      onSave={async (productReturned, returnedServing) => {
        if (product) {
          updateMealProduct(productId!, returnedServing);

          router.replace(`/(tabs)/automations/meal/${mealId}`);

          return;
        }

        // TODO: This probably shouldn't be needed
        // TODO: Also the API where you pass a ID and object is weird
        const productCast = productReturned as Product;

        insertMealProduct(productCast.uuid, returnedServing, productCast);

        router.replace(`/(tabs)/automations/meal/${mealId}`);
      }}
    />
  );
}
