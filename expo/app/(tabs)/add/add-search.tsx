import { useRouter } from "expo-router";
import { Meal, ProductSearch } from "@/types";

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

  const handleMealSelect = (meal: Meal) => {
    insertEntry.mutateAsync({
      meal_id: meal.uuid,
      product_id: null,
      consumed_gram: null,
      consumed_quantity: null,
      consumed_option: null,
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
