import { GenericSearchData, ProductSearchData } from "@/schema";

export async function processSearchProduct(
  headers: Headers,
  {
    uuid,
    lang,
    search,
    barcode,
  }: {
    uuid: string;
    lang: string;
    search: ProductSearchData;
    barcode?: string;
  },
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

  await Promise.all([
    fetch(
      `${process.env.SWIFTBITE_API_URL}/api/ai-functions/product-options?${params.toString()}`,
      {
        headers,
      },
    ),

    fetch(
      `${process.env.SWIFTBITE_API_URL}/api/ai-functions/product-search-product?${params.toString()}`,
      {
        headers,
      },
    ),
  ]);
}

export async function processSearchGeneric(
  headers: Headers,
  {
    uuid,
    lang,
    search,
  }: {
    uuid: string;
    lang: string;
    search: GenericSearchData;
  },
) {
  const params = new URLSearchParams({
    uuid,
    lang,
    title: search.title,
    category: search.category,
  });

  await Promise.all([
    fetch(
      `${process.env.SWIFTBITE_API_URL}/api/ai-functions/product-options?${params.toString()}`,
      {
        headers,
      },
    ),
    fetch(
      `${process.env.SWIFTBITE_API_URL}/api/ai-functions/product-search-generic?${params.toString()}`,
      {
        headers,
      },
    ),
  ]);
}
