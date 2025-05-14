import { useRouter } from "expo-router";
import { ServingData } from "@/schemas/serving";

import PageSearch from "@/components/Page/Search";
import useInsertEntry from "@/mutations/useInsertEntry";

export default function AddText() {
  const router = useRouter();

  const insertEntry = useInsertEntry();

  const handleProductSelect = (product: string) => {
    router.push({
      pathname: "/add/add-product",
      params: { product },
    });
  };

  const handleMealSelect = (meal: string, serving: ServingData) => {
    insertEntry.mutateAsync({
      serving,
      meal_id: meal,
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
