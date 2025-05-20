import { Product } from "@/types/product";
import { queryOptions } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

type barcodeDataType = {
  search?: boolean;
  barcode: string;
};

export default function barcodeData({
  search = false,
  barcode,
}: barcodeDataType) {
  return queryOptions({
    queryKey: ["barcodeData", barcode, search],
    queryFn: async (): Promise<Product[]> => {
      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;
      const headers = {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      };

      const url = search
        ? `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/barcode-search?barcode=${barcode}&lang=nl`
        : `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/barcode?barcode=${barcode}&lang=nl`;

      const response = await fetch(url, { headers });

      if (response.status === 404) {
        return [];
      }

      const products = await response.json();

      return [products];
    },
  });
}
