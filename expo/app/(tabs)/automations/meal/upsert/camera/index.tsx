import PageCamera from "@/components/Page/Camera";

import { useRouter } from "expo-router";

export default function AutomationsMealUpsertCamera() {
  const router = useRouter();

  const handleBarcode = (barcode: string) => {
    router.push({
      pathname: "/automations/meal/upsert/product",
      params: { barcode },
    });
  };

  return <PageCamera onBarcode={handleBarcode} />;
}
