import { useRouter } from "expo-router";

import PageSearch from "@/components/Page/Search";

export default function AutomationsRepeatUpsertSearch() {
  const router = useRouter();

  const handleMealSelect = (meal: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/meal`,
      params: { meal },
    });
  };

  const handleProductSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/product`,
      params: { product },
    });
  };

  return (
    <PageSearch
      onMealSelect={handleMealSelect}
      onProductSelect={handleProductSelect}
    />
  );
}
