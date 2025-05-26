import { useQuery } from "@tanstack/react-query";
import { useProduct } from "@/hooks/useProduct";
import { ServingData } from "@/schemas/serving";
import { useEditRepeat } from "@/context/RepeatContext";
import { Redirect, router, useLocalSearchParams } from "expo-router";

import userData from "@/queries/userData";

import PageProduct from "@/components/Page/Product";
import PageProductLoading from "@/components/Page/Product/Loading";

export default function AutomationsRepeatUpsertProduct() {
  const {
    product: productEditing,
    serving,
    remove,
    updateProduct,
    updateServing,
  } = useEditRepeat();

  const { product: productId, barcode: barcodeId } = useLocalSearchParams<{
    product?: string;
    barcode?: string;
  }>();

  const { data: user, isLoading: isLoadingUser } = useQuery(userData());
  const { product: productSearch, isLoading: isLoadingSearch } = useProduct({
    productId,
    barcodeId,
    enabled: !productEditing,
    redirect: "/(tabs)/automations/repeat/upsert/search",
  });

  if (isLoadingSearch || isLoadingUser) {
    return <PageProductLoading editing={!!serving} />;
  }

  const product = productEditing || productSearch;

  if (!product || !user) {
    return <Redirect href="/(tabs)/automations/repeat/upsert" />;
  }

  const handleSave = async (returnedServing: ServingData) => {
    updateProduct(product);
    updateServing(returnedServing);

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  const handleDelete = () => {
    remove();

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  return (
    <PageProduct
      user={user}
      product={product}
      serving={serving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
