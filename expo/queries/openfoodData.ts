import { queryOptions } from "@tanstack/react-query";

import supabase from "@/utils/supabase";
import { Product } from "@/types/product";

type openfoodDataType = {
  barcode?: string;
  title?: string;
  brand?: string;
  quantity_original?: string;
  quantity_original_unit?: string;
};

export default function openfoodData({
  barcode,
  title,
  brand,
  quantity_original,
  quantity_original_unit,
}: openfoodDataType) {
  return queryOptions({
    queryKey: [
      "openfoodData",
      barcode,
      title,
      brand,
      quantity_original,
      quantity_original_unit,
    ],
    queryFn: async (): Promise<Product[]> => {
      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;
      const headers = {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      };

      const url = barcode
        ? `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/barcode?code=${barcode}&lang=nl`
        : `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/product?title=${title}&lang=nl&brand=${brand}&quantity_original=${quantity_original}&quantity_original_unit=${quantity_original_unit}`;

      const response = await fetch(url, { headers });
      const products = await response.json();

      return products || [];
    },
  });
}
