import productBarcode from "@/queries/barcodeData";
import productData from "@/queries/productData";

import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

type UseProductProps = {
  productId?: string;
  barcodeId?: string;
  enabled?: boolean;
};

export function useProduct({
  productId,
  barcodeId,
  enabled = true,
}: UseProductProps) {
  const router = useRouter();

  const [search, setSearch] = useState(false);
  const [interval, setInterval] = useState<number | false>(false);

  // Use barcode query if barcode is provided
  const queryBarcode = useQuery({
    ...productBarcode({ barcode: barcodeId!, search }),
    select: (products) => products[0],
    refetchInterval: interval,
    enabled: enabled && !!barcodeId,
  });

  // Use product ID query if productId is provided
  const queryProduct = useQuery({
    ...productData({ uuid: productId! }),
    select: (products) => products[0],
    refetchInterval: interval,
    enabled: enabled && !!productId,
  });

  // Determine which query to use
  const { data: product, isLoading } = barcodeId ? queryBarcode : queryProduct;

  // Handle refetch interval based on product processing state
  useEffect(() => {
    const processing = product?.processing;
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [product]);

  useEffect(() => {
    // If we're not looking up a barcode we don't need to show the alert
    if (!barcodeId) {
      return;
    }

    // If the product is still loading we don't need to show the alert
    if (isLoading) {
      return;
    }

    // If the product is found we don't need to show the alert
    if (product) {
      return;
    }

    if (!search) {
      Alert.alert("Product niet gevonden", "Wat wilt u doen?", [
        {
          text: "Online zoeken",
          onPress: () => {
            setSearch(true);
          },
        },
        {
          text: "Naar zoeken",
          onPress: () => {
            router.replace("/(tabs)/add/add-search");
          },
        },
      ]);

      return;
    }

    Alert.alert(
      "Product niet gevonden",
      "We hebben het product ook niet online gevonden.",
      [
        {
          text: "Ok",
          onPress: () => {
            router.replace("/(tabs)/add/add-search");
          },
        },
      ]
    );
  }, [product, isLoading, search, router, barcodeId]);

  const loadingProduct = isLoading;
  const loadingBarcode = isLoading || (!search && !product);

  return {
    product,
    isLoading: productId ? loadingProduct : loadingBarcode,
  };
}
