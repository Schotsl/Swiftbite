import { useRouter } from "expo-router";
import { ProductSearch } from "@/types";

import PageSearch from "@/components/Page/Search";

export default function AutomationRepeatUpsertSearch() {
  const router = useRouter();

  const handleProductSelect = (item: ProductSearch) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/product`,
      params: { product: item.uuid },
    });
  };

  return (
    <PageSearch onProductSelect={handleProductSelect} onMealSelect={() => {}} />
  );
}
