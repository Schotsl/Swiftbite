import { NextResponse } from "next/server";
import { handleError } from "../helper";

import supabase from "./supabase";

export async function validateUsage(user: string) {
  const now = Date.now();
  const hourTimestamp = new Date(now - 60 * 60 * 1000).toISOString();
  const yearTimestamp = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString();

  const [hourResult, yearResult] = await Promise.all([
    supabase
      .from("usage")
      .select(
        "input_tokens:input_tokens.sum(), output_tokens:output_tokens.sum()"
      )
      .eq("user_id", user)
      .gte("created_at", hourTimestamp),
    supabase
      .from("usage")
      .select(
        "input_tokens:input_tokens.sum(), output_tokens:output_tokens.sum()"
      )
      .eq("user_id", user)
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
}
