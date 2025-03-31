import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "./utils/supabase";
import { handleError } from "./helper";

export async function middleware(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.replace("Bearer ", "");

  const { error: userError, data: userData } =
    await supabase.auth.getUser(token);

  handleError(userError);

  const uuid = userData.user?.id;

  if (!uuid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const hourTimestamp = new Date(now - 60 * 60 * 1000).toISOString();
  const yearTimestamp = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString();

  const [hourResult, yearResult] = await Promise.all([
    supabase
      .from("usage")
      .select(
        "input_tokens:input_tokens.sum(), output_tokens:output_tokens.sum()"
      )
      .eq("user_id", uuid)
      .gte("created_at", hourTimestamp),
    supabase
      .from("usage")
      .select(
        "input_tokens:input_tokens.sum(), output_tokens:output_tokens.sum()"
      )
      .eq("user_id", uuid)
      .gte("created_at", yearTimestamp),
  ]);

  handleError(hourResult.error);
  handleError(yearResult.error);

  const hourInput = hourResult.data?.[0]?.input_tokens || 0;
  const hourOutput = hourResult.data?.[0]?.output_tokens || 0;

  const yearInput = yearResult.data?.[0]?.input_tokens || 0;
  const yearOutput = yearResult.data?.[0]?.output_tokens || 0;

  if (hourInput > 1000 || hourOutput > 1000) {
    return NextResponse.json(
      { error: "Hourly limit exceeded" },
      { status: 429 }
    );
  }

  if (yearInput > 500000 || yearOutput > 500000) {
    return NextResponse.json(
      { error: "Yearly limit exceeded" },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/ai/:path*",
};
