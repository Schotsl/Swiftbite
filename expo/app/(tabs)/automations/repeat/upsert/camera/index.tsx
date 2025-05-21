import PageCamera from "@/components/Page/Camera";

import { useRouter } from "expo-router";

export default function AutomationsRepeatUpsertCamera() {
  const router = useRouter();

  const handleBarcode = (barcode: string) => {
    router.push({
      pathname: "/automations/repeat/upsert/product",
      params: { barcode },
    });
  };

  return <PageCamera onBarcode={handleBarcode} />;
}
