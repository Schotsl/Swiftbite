import { getUser } from "@/utils/supabase";
import { generateVision } from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser(request);

  const { base64 } = await request.json();

  if (!base64) {
    return NextResponse.json(
      { error: "Please provide a base64 image" },
      { status: 400 }
    );
  }

  const feedback = await generateVision(user!, { base64 });
  const response = NextResponse.json({ feedback });

  return response;
}
