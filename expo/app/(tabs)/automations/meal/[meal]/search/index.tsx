import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductSearch } from "@/types";

import PageSearch from "@/components/Page/Search";

export default function AddText() {
  const router = useRouter();

  const { meal } = useLocalSearchParams<{ meal: string }>();

  const handleProductSelect = (item: ProductSearch) => {
    router.push({
      pathname: `/(tabs)/automations/meal/[meal]/product`,
      params: {
        meal,
        ...item,
      },
    });
  };

  return (
    <PageSearch onProductSelect={handleProductSelect} onMealSelect={() => {}} />
  );
}
