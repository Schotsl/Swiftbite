import { getUser, supabase } from "@/utils/supabase";
import { after, NextRequest, NextResponse } from "next/server";
import { generateOptions, searchProduct } from "@/utils/openai";
import { Product } from "@/types";
import { generateSlug, handleError } from "@/helper";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const title = request.nextUrl.searchParams.get("title");
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

  if (!title) {
    return NextResponse.json(
      { error: "Please provide a title" },
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
      { error: "Please provide a quantity_original" },
      { status: 400 }
    );
  }

  if (!quantity_original_unit) {
    return NextResponse.json(
      { error: "Please provide a quantity_original_unit" },
      { status: 400 }
    );
  }

  const [productOptions, productInsert] = await Promise.all([
    generateOptions(user!, { title, lang }),
    searchProduct(
      user!,
      { title, lang, brand, quantity_original, quantity_original_unit },
      request.signal
    ),
  ]);

  if (!productInsert) {
    return NextResponse.json({ error: "No product found" }, { status: 404 });
  }

  const product: Product = {
    uuid: crypto.randomUUID(),
    type: "generative",
    favorite: false,
    options: productOptions.map((option) => ({
      value: generateSlug(option.title),
      title: option.title,
      gram: option.gram,
    })),

    icon_id: null,
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
