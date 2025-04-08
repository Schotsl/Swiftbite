import { queryOptions } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

type openfoodDataType = {
  barcode?: string;
  title?: string;
  brand?: string;
  quantity?: string;
};

export default function openfoodData({
  barcode,
  title,
  brand,
  quantity,
}: openfoodDataType) {
  return queryOptions({
    queryKey: ["openfoodData", barcode, title, brand, quantity],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;
      const headers = {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      };

      const url = barcode
        ? `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/barcode?code=${barcode}&lang=nl`
        : `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/product?query=${title}&lang=nl&brand=${brand}&quantity=${quantity}`;

      const response = await fetch(url, { headers });
      const products = await response.json();

      return products;
    },
  });
}
