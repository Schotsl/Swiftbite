import productBarcode from "@/queries/barcodeData";
import productData from "@/queries/productData";

import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";

type UseProductProps = {
  productId?: string;
  barcodeId?: string;
  enabled?: boolean;
  redirect: {
    label: Href;
    search: Href;
    cancel: Href;
  };
};

export function useProduct({
  productId,
  barcodeId,
  enabled = true,
  redirect,
}: UseProductProps) {
  const router = useRouter();

  const [asking, setAsking] = useState(false);
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
  const { data: product, isLoading: isLoadingQuery } = barcodeId
    ? queryBarcode
    : queryProduct;

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
    if (isLoadingQuery) {
      return;
    }

    // If the product is found we don't need to show the alert
    if (product) {
      return;
    }

    if (!search && !asking) {
      setAsking(true);

      // TODO: language
      Alert.alert(
        "Product niet gevonden",
        "We hebben het product niet gevonden, maar we kunnen de barcode online proberen te zoeken",
        [
          {
            text: "Barcode online zoeken",
            onPress: () => {
              setSearch(true);
              setAsking(false);
            },
          },
          {
            text: "Product online zoeken",
            onPress: () => {
              router.replace(redirect.search);

              setAsking(false);
            },
          },
          {
            text: "Product zelf toevoegen",
            onPress: () => {
              Alert.alert("TODO", "Voedingslabel scannen");

              setAsking(false);
            },
          },
          {
            text: "Voedingslabel scannen",
            onPress: () => {
              router.replace(redirect.label);

              setAsking(false);
            },
          },
          {
            text: "Annuleren",
            style: "cancel",
            onPress: () => {
              router.replace(redirect.cancel);

              setAsking(false);
            },
          },
        ]
      );

      return;
    }

    // If we have searched online and still not found the product
    if (search && !product && !asking) {
      setAsking(true);
      // TODO: language
      Alert.alert(
        "Product niet gevonden",
        "We hebben het product ook niet online gevonden. Wat wil je doen?",
        [
          {
            text: "Product online zoeken",
            onPress: () => {
              router.replace(redirect.search);
              setAsking(false);
            },
          },
          {
            text: "Product zelf toevoegen",
            onPress: () => {
              Alert.alert("TODO", "Voedingslabel scannen");
              setAsking(false);
            },
          },
          {
            text: "Voedingslabel scannen",
            onPress: () => {
              router.replace(redirect.label);
              setAsking(false);
            },
          },
          {
            text: "Annuleren",
            style: "cancel",
            onPress: () => {
              router.replace(redirect.cancel);

              setAsking(false);
            },
          },
        ]
      );
    }
  }, [product, isLoadingQuery, search, router, barcodeId, redirect, asking]);

  const getLoading = () => {
    if (!enabled) {
      return false;
    }

    if (asking) {
      return true;
    }

    if (productId) {
      return queryProduct.isLoading;
    }

    return queryBarcode.isLoading;
  };

  return {
    product,
    isLoading: getLoading(),
  };
}
