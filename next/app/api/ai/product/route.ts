import { getUser, supabase } from "@/utils/supabase";
import { after, NextRequest, NextResponse } from "next/server";
import { searchProduct } from "@/utils/openai";
import { Product } from "@/types";
import { handleError } from "@/helper";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const query = request.nextUrl.searchParams.get("query");
  const brand = request.nextUrl.searchParams.get("brand");

  const quantity_original =
    request.nextUrl.searchParams.get("quantity_original");

  const quantity_original_unit = request.nextUrl.searchParams.get(
    "quantity_original_unit"
  );

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a query" },
      { status: 400 }
    );
  }

  if (!brand) {
    return NextResponse.json(
      { error: "Please provide a brand" },
      { status: 400 }
    );
  }

  if (!quantity_original) {
    return NextResponse.json(
      { error: "Please provide a quantity" },
      { status: 400 }
    );
  }

  if (!quantity_original_unit) {
    return NextResponse.json(
      { error: "Please provide a quantity unit" },
      { status: 400 }
    );
  }

  const productInsert = await searchProduct(
    user!,
    query,
    lang,
    brand,
    quantity_original,
    quantity_original_unit,
    request.signal
  );

  if (!productInsert) {
    return NextResponse.json({ error: "No product found" }, { status: 404 });
  }

  const product: Product = {
    uuid: crypto.randomUUID(),

    user_id: user!,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    ...productInsert,
  };

  after(async () => {
    const { error } = await supabase.from("product").insert(product);

    handleError(error);
  });

  const response = NextResponse.json(product);
  return response;
}
