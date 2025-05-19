import PageProduct from "@/components/Page/Product";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { useEditRepeat } from "@/context/RepeatContext";
import { Redirect, router, useLocalSearchParams } from "expo-router";

import productData from "@/queries/productData";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

export default function AutomationRepeatUpsertProduct() {
  const {
    product: productEditing,
    serving,
    updateProduct,
    removeProduct,
    updateServing,
  } = useEditRepeat();

  const { product: productId, barcode } = useLocalSearchParams<{
    product?: string;
    barcode?: string;
  }>();

  const { data: productSearch, isLoading: isLoadingSearch } = useQuery({
    ...productData(productId ? { uuid: productId! } : { barcode: barcode! }),
    select: (products) => products[0],
    enabled: !productEditing,
  });

  if (isLoadingSearch) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const product = productEditing || productSearch;

  if (!product) {
    return <Redirect href="/(tabs)/automations/repeat/upsert" />;
  }

  const handleSave = async (returnedServing: ServingData) => {
    updateProduct(product);
    updateServing(returnedServing);

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  const handleDelete = () => {
    removeProduct();

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  return (
    <PageProduct
      product={product}
      serving={serving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
