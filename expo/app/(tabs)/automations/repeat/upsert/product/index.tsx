import PageProduct from "@/components/Page/Product";

import { Product } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import repeatData from "@/queries/repeatData";

export default function AutomationRepeatUpsertProduct() {
  const {
    time,
    repeat: repeatId,
    weekdays,
  } = useLocalSearchParams<{
    time: string;
    repeat?: string;
    weekdays: string;
  }>();

  const { data: repeat } = useQuery({
    ...repeatData(),
    select: (repeats) => repeats.find((repeat) => repeat.uuid === repeatId),
    enabled: !!repeatId,
  });

  return (
    <PageProduct
      product={repeat?.product}
      onSave={async (productReturned, returnedServing) => {
        const productCast = productReturned as Product;

        router.replace({
          pathname: "/(tabs)/automations/repeat/upsert",
          params: {
            repeat: repeatId,
            product: productCast.uuid,
            serving_gram: returnedServing.gram,
            serving_option: returnedServing.option,
            serving_quantity: returnedServing.quantity,
            time,
            weekdays,
          },
        });
        // if (product) {
        //   updateMealProduct(productId!, returnedServing);
        //   router.replace(`/(tabs)/automations/meal/${mealId}`);
        //   return;
        // }
        // // TODO: This probably shouldn't be needed
        // // TODO: Also the API where you pass a ID and object is weird
        // const productCast = productReturned as Product;
        // insertMealProduct(productCast.uuid, returnedServing, productCast);
        // router.replace(`/(tabs)/automations/meal/${mealId}`);
      }}
    />
  );
}
