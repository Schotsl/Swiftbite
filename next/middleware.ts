import { NextRequest, NextResponse } from "next/server";
import { validateUsage } from "./utils/usage";
import { getUser } from "./utils/supabase";

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
  const user = await getUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await validateUsage(user);

  if (response) {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/ai/:path*", "/api/ai-server/:path*"],
};
