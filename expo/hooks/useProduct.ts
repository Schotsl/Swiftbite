import productBarcode from "@/queries/barcodeData";
import productData from "@/queries/productData";

import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import language from "@/language";

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
  const [cancel, setCancel] = useState(false);
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

    // TODO: This really needs to be refactored
    if (!search && !asking && !cancel) {
      setAsking(true);

      Alert.alert(
        language.barcode.alert.barcode.title,
        language.barcode.alert.barcode.subtitle,
        [
          {
            text: language.barcode.actions.barcode,
            onPress: () => {
              setSearch(true);
              setAsking(false);
            },
          },
          {
            text: language.barcode.actions.manual,
            onPress: () => {
              router.replace(redirect.search);

              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.barcode.actions.add,
            onPress: () => {
              Alert.alert(
                language.alert.development.title,
                language.alert.development.subtitle,
              );

              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.barcode.actions.label,
            onPress: () => {
              router.replace(redirect.label);

              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.modifications.uppercase.cancel,
            style: "cancel",
            onPress: () => {
              router.replace(redirect.cancel);

              setAsking(false);
              setCancel(true);
            },
          },
        ],
      );

      return;
    }

    // If we have searched online and still not found the product
    if (search && !product && !asking && !cancel) {
      setAsking(true);
      Alert.alert(
        language.barcode.alert.search.title,
        language.barcode.alert.search.subtitle,
        [
          {
            text: language.barcode.actions.manual,
            onPress: () => {
              router.replace(redirect.search);
              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.barcode.actions.add,
            onPress: () => {
              Alert.alert(
                language.alert.development.title,
                language.alert.development.subtitle,
              );

              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.barcode.actions.label,
            onPress: () => {
              router.replace(redirect.label);

              setAsking(false);
              setCancel(true);
            },
          },
          {
            text: language.modifications.uppercase.cancel,
            style: "cancel",
            onPress: () => {
              router.replace(redirect.cancel);

              setAsking(false);
              setCancel(true);
            },
          },
        ],
      );
    }
  }, [
    product,
    isLoadingQuery,
    search,
    router,
    barcodeId,
    redirect,
    asking,
    cancel,
  ]);

  const getLoading = () => {
    if (!enabled) {
      return false;
    }

    if (cancel) {
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
    // @David idk why this is needed
    product: enabled ? product : undefined,
    isLoading: getLoading(),
  };
}
