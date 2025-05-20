import { GenericSearchData, ProductSearchData } from "@/schema";

const headers = {
  "X-Supabase-Secret": process.env.SWIFTBITE_WEBHOOK_SECRET!,
};

export function processSearchProduct(
  uuid: string,
  lang: string,
  search: ProductSearchData,
  barcode?: string
) {
  const params = new URLSearchParams({
    uuid,
    lang,
    title: search.title,
    brand: search.brand,
  });

  if (search.quantity_original) {
    params.set("quantity_original", search.quantity_original.toString());
  }

  if (search.quantity_original_unit) {
    params.set("quantity_original_unit", search.quantity_original_unit);
  }

  if (barcode) {
    params.set("barcode", barcode);
  }

  fetch(
    `${process.env.SWIFTBITE_API_URL}/api/ai-server/search-product-data?${params.toString()}`,
    {
      headers,
    }
  );

  fetch(
    `${process.env.SWIFTBITE_API_URL}/api/ai-server/product-options?${params.toString()}`,
    {
      headers,
    }
  );
}

export function processSearchGeneric(
  uuid: string,
  lang: string,
  search: GenericSearchData
) {
  const params = new URLSearchParams({
    uuid,
    lang,
    title: search.title,
    category: search.category,
  });

  fetch(
    `${process.env.SWIFTBITE_API_URL}/api/ai-server/search-generic-data?${params.toString()}`,
    {
      headers,
    }
  );

  fetch(
    `${process.env.SWIFTBITE_API_URL}/api/ai-server/product-options?${params.toString()}`,
    {
      headers,
    }
  );
}
