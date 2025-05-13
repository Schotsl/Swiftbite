import { supabase } from "@/utils/supabase";
import { generateSlug, handleError } from "@/helper";
import { generateOptions } from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get("uuid");
  const lang = request.nextUrl.searchParams.get("lang");
  const title = request.nextUrl.searchParams.get("title");
  const brand = request.nextUrl.searchParams.get("brand");

  if (!uuid) {
    return NextResponse.json(
      { error: "Please provide a uuid" },
      { status: 400 }
    );
  }

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

  console.log(`[OPTIONS/${title}] Generating options`);

  const options = await generateOptions({ title, lang, brand });
  const optionsMapped = options.map((option) => ({
    value: generateSlug(option.title),
    title: option.title,
    gram: option.gram,
  }));

  console.log(`[OPTIONS/${title}] Inserting options into database`);

  const { error } = await supabase
    .from("test")
    .update({ options: optionsMapped })
    .eq("uuid", uuid);

  handleError(error);

  const response = NextResponse.json({}, { status: 200 });
  return response;
}
