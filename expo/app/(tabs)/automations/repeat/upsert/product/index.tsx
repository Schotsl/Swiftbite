import PageProduct from "@/components/Page/Product";

import { router } from "expo-router";
import { useEditRepeat } from "@/context/RepeatContext";
import { ServingData } from "@/schemas/serving";

export default function AutomationRepeatUpsertProduct() {
  const { product, serving, removeProduct, updateServing } = useEditRepeat();

  const handleSave = async (returnedServing: ServingData) => {
    updateServing(returnedServing);

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  const handleDelete = () => {
    removeProduct();

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  return (
    <PageProduct
      product={product!}
      serving={serving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
