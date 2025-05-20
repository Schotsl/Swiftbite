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

      const params = new URLSearchParams();

      params.append("code", barcode);
      params.append("lang", "nl");

      if (search) {
        params.append("search", "true");
      }

      const url = `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/barcode?${params.toString()}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        return [];
      }

      const products = await response.json();

      return [products];
    },
  });
}
