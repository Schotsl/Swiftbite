import { useRouter } from "expo-router";
import { ProductSearch } from "@/types";

import PageSearch from "@/components/Page/Search";

export default function AddText() {
  const router = useRouter();

  const handleProductSelect = (product: ProductSearch) => {
    router.push({
      pathname: `/(tabs)/automations/meal/upsert/product`,
      params: { product: product.uuid },
    });
  };

  return (
    <PageSearch onProductSelect={handleProductSelect} onMealSelect={() => {}} />
  );
}
