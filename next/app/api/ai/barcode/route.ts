import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

import { Product } from "@/types";
import { mapProduct } from "@/utils/openfood";
import { handleError } from "@/helper";
import { after, NextRequest, NextResponse } from "next/server";
import { fetchProductByBarcode, getUser, supabase } from "@/utils/supabase";

const client = new OpenFoodFacts(fetch);

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const barcode = request.nextUrl.searchParams.get("barcode");

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

  // Fetch product from supabase and openfood in parallel
  const [productSupabase, productOpenfood] = await Promise.all([
    fetchProductByBarcode(barcode),
    client.getProduct(barcode),
  ]);

  // If product is already in supabase return it
  if (productSupabase) {
    return NextResponse.json(productSupabase);
  }

  if (!productOpenfood) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productMapped = await mapProduct(user!, productOpenfood);
  const productFinished: Product = {
    uuid: crypto.randomUUID(),

    user_id: user!,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    ...productMapped,
  };

  after(async () => {
    // Idk why we insert after the response is sent
    const { error } = await supabase.from("product").insert(productFinished);

    handleError(error);
  });

  return NextResponse.json(productFinished);
}
