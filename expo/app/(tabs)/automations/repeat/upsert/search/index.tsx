import { useRouter } from "expo-router";

import PageSearch from "@/components/Page/Search";

export default function AutomationRepeatUpsertSearch() {
  const router = useRouter();

  const handleProductSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/product`,
      params: { product },
    });
  };

  return <PageSearch onProductSelect={handleProductSelect} meal={false} />;
}
