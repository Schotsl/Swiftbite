import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

import { Product } from "@/types";
import { mapProduct } from "@/utils/openfood";
import { fetchProductByBarcode, getUser, supabase } from "@/utils/supabase";
import { after, NextRequest, NextResponse } from "next/server";
import { handleError } from "@/helper";

const client = new OpenFoodFacts(fetch);

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const code = request.nextUrl.searchParams.get("code");
  const lang = request.nextUrl.searchParams.get("lang");

  if (!code) {
    return NextResponse.json(
      { error: "Please provide a code" },
      { status: 400 }
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  // Fetch product from supabase and openfood in parallel
  const [productSupabase, productOpenfood] = await Promise.all([
    fetchProductByBarcode(code),
    client.getProduct(code),
  ]);

  // If product is already in supabase return it
  if (productSupabase) {
    return NextResponse.json(productSupabase);
  }

  if (!productOpenfood) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productMapped = await mapProduct(user!, productOpenfood, lang);
  const productFinished: Product = {
    type: "barcode",
    uuid: crypto.randomUUID(),

    user_id: user!,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    ...productMapped,
  };

  after(async () => {
    const { error } = await supabase.from("product").insert(productFinished);

    handleError(error);
  });

  return NextResponse.json(productFinished);
}
