import { useRouter } from "expo-router";
import { Meal, MealWithProduct, ProductSearch } from "@/types";

import PageSearch from "@/components/Page/Search";
import useInsertEntry from "@/mutations/useInsertEntry";

export default function AddText() {
  const router = useRouter();

  const insertEntry = useInsertEntry();

  const handleProductSelect = (product: ProductSearch) => {
    router.push({
      pathname: "/add/add-product",
      params: product,
    });
  };

  const handleMealSelect = (meal: MealWithProduct) => {
    insertEntry.mutateAsync({
      meal_id: meal.uuid,
      product_id: null,
      consumed_gram: meal.quantity_gram,
      consumed_quantity: 1,
      consumed_option: "meal",
    });

    router.push({
      pathname: "/(tabs)/add",
    });
  };

  return (
    <PageSearch
      onMealSelect={handleMealSelect}
      onProductSelect={handleProductSelect}
    />
  );
}
