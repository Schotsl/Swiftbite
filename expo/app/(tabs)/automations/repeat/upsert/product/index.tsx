import PageProduct from "@/components/Page/Product";

import { router } from "expo-router";
import { Product } from "@/types";
import { useEditRepeat } from "@/context/RepeatContext";

export default function AutomationRepeatUpsertProduct() {
  const { product, serving, updateProduct, updateServing } = useEditRepeat();

  return (
    <PageProduct
      product={product}
      serving={serving}
      onSave={async (productReturned, returnedServing) => {
        if (product) {
          updateServing(returnedServing);

          router.replace("/(tabs)/automations/repeat/upsert");

          return;
        }

        const productCast = productReturned as Product;

        updateProduct(productCast);
        updateServing(returnedServing);

        router.replace("/(tabs)/automations/repeat/upsert");
      }}
    />
  );
}
