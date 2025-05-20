import * as crypto from "crypto";

import { searchBarcode } from "@/utils/generative/barcode";
import { fatsecretRequest } from "@/utils/internet";
import { getProductFromSearch } from "@/utils/search";
import { processSearchProduct } from "@/utils/processing";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import {
  getUser,
  insertProduct,
  fetchProductByBarcode,
} from "@/utils/supabase";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lang = request.nextUrl.searchParams.get("lang");
  const barcode = request.nextUrl.searchParams.get("barcode");

  const seed = crypto.randomUUID();
  const signal = request.signal;

  if (!barcode) {
    return NextResponse.json(
      { error: "Please provide a barcode" },
      { status: 400 },
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  const productSupabase = await fetchProductByBarcode(barcode);

  if (productSupabase) {
    return NextResponse.json(productSupabase);
  }

  const promises = [
    googleRequest(barcode, signal),
    openfoodRequest(barcode, lang, signal),
    fatsecretRequest(barcode, signal),
  ];

  const [google, openfood, fatsecret] = await Promise.all(promises);

  const search = await searchBarcode(user, {
    barcode,
    google,
    openfood,
    fatsecret,
  });

  if (!search) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = getProductFromSearch({
    seed,
    search,
    barcode,
  });

  // The UUID has already been generated but we'll await anyway so we're certain the user can fetch it
  await insertProduct(product);

  after(async () => {
    const { uuid } = product;

    processSearchProduct({
      uuid,
      lang,
      search,
      barcode,
    });
  });

  return NextResponse.json(product);
}
