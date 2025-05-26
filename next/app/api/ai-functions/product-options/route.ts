import { generateOptions } from "@/utils/generative/generate";
import { getUser, supabase } from "@/utils/supabase";
import { generateSlug, handleError } from "@/helper";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const uuid = request.nextUrl.searchParams.get("uuid");
  const lang = request.nextUrl.searchParams.get("lang");
  const title = request.nextUrl.searchParams.get("title");

  const brand = request.nextUrl.searchParams.get("brand") || undefined;
  const category = request.nextUrl.searchParams.get("category") || undefined;

  if (!uuid) {
    return NextResponse.json(
      { error: "Please provide a uuid" },
      { status: 400 },
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  if (!title) {
    return NextResponse.json(
      { error: "Please provide a title" },
      { status: 400 },
    );
  }

  if (!user) console.log(`[OPTIONS/${title}] Generating options`);

  const options = await generateOptions(user, { title, brand, category });
  const optionsMapped = options.map((option) => ({
    value: generateSlug(option.title),
    title: option.title,
    gram: option.gram,
  }));

  console.log(`[OPTIONS/${title}] Inserting options into database`);

  const { error } = await supabase
    .from("product")
    .update({ options: optionsMapped })
    .eq("uuid", uuid);

  handleError(error);

  const response = NextResponse.json({}, { status: 200 });
  return response;
}
