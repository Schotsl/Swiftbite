import { fetchProductFromOpenfood } from "@/utils/openfood";
import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  insertProduct,
  fetchProductByBarcode,
} from "@/utils/supabase";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const barcode = request.nextUrl.searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json(
      { error: "Please provide a barcode" },
      { status: 400 }
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  // If product is already in supabase return it
  const productSupabase = await fetchProductByBarcode(barcode);

  if (productSupabase) {
    return NextResponse.json(productSupabase);
  }

  // Otherwise we'll look for it on openfood
  const productOpenfood = await fetchProductFromOpenfood(user, barcode);

  if (!productOpenfood) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Insert the product into supabase and then return it
  const productInserted = await insertProduct(productOpenfood);

  return NextResponse.json(productInserted);
}
