import { NextRequest, NextResponse } from "next/server";
import { validateUsage } from "./utils/usage";
import supabase from "./utils/supabase";
import { handleError } from "./helper";

export async function middleware(request: NextRequest) {
  // Check calls from the Supabase database
  if (request.nextUrl.pathname.startsWith("/api/ai-server")) {
    const secret = request.headers.get("X-Supabase-Secret");

    if (secret !== process.env.SWIFTBITE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Check calls from the client-side
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.replace("Bearer ", "");

  const { error, data } = await supabase.auth.getUser(token);

  handleError(error);

  const uuid = data.user?.id;

  if (!uuid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await validateUsage(uuid);

  if (response) {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/ai/:path*", "/api/ai-server/:path*"],
};
