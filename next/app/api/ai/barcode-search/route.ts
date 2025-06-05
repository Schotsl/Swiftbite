import * as crypto from "crypto";

import { searchBarcode } from "@/utils/generative/barcode";
import { fatsecretRequest } from "@/utils/internet";
import { getProductFromSearch } from "@/utils/search";
import { processSearchProduct } from "@/utils/processing";
import { openfoodRequestBarcode, googleRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import {
  getUser,
  insertProduct,
  fetchProductByBarcode,
} from "@/utils/supabase";

// I've given this function a very high timeout since it has to await a bunch further AI processing calls
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const headers = request.headers;

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
    openfoodRequestBarcode(barcode),
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

    await processSearchProduct(headers, {
      uuid,
      lang,
      search,
      barcode,
    });
  });

  return NextResponse.json(product);
}
