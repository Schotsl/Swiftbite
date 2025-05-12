import { useRouter } from "expo-router";
import { MealWithProduct, ProductSearch } from "@/types";

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
    const serving = {
      gram: meal.quantity_gram,
      quantity: 1,
      option: "meal",
    };

    insertEntry.mutateAsync({
      serving,
      meal_id: meal.uuid,
      product_id: null,
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
