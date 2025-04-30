import PageProduct from "@/components/Page/Product";

import { router } from "expo-router";
import { Product } from "@/types";
import { useEditRepeat } from "@/context/RepeatContext";

export default function AutomationRepeatUpsertProduct() {
  const { product, serving, removeProduct, updateProduct, updateServing } =
    useEditRepeat();

  return (
    <PageProduct
      product={product}
      serving={serving}
      onDelete={() => {
        removeProduct();

        router.replace("/(tabs)/automations/repeat/upsert");
      }}
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
