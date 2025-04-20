import { NextResponse } from "next/server";
import { handleError } from "@/helper";
import { Enums } from "@/database.types";

import { supabase } from "./supabase";
import { LanguageModelUsage } from "ai";

export async function insertUsage({
  user,
  task,
  model,
  usage,
}: {
  user: string;
  task: Enums<"task">;
  model: string;
  usage: LanguageModelUsage;
}) {
  const { error } = await supabase.from("usage").insert({
    task,
    model,
    user_id: user,
    input_tokens: usage.promptTokens,
    output_tokens: usage.completionTokens,
  });

  handleError(error);
}

export async function validateUsage(user: string) {
  const now = Date.now();
  const hourTimestamp = new Date(now - 60 * 60 * 1000).toISOString();
  const yearTimestamp = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString();

  const [minuteResult, hourResult, yearResult] = await Promise.all([
    supabase
      .from("usage")
      .select(
        "input_tokens:input_tokens.sum(), output_tokens:output_tokens.sum()"
      )
      .eq("user_id", user)
      .gte("created_at", new Date(now - 60 * 1000).toISOString()),
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

  const minuteInput = minuteResult.data?.[0]?.input_tokens || 0;
  const minuteOutput = minuteResult.data?.[0]?.output_tokens || 0;

  const hourInput = hourResult.data?.[0]?.input_tokens || 0;
  const hourOutput = hourResult.data?.[0]?.output_tokens || 0;

  const yearInput = yearResult.data?.[0]?.input_tokens || 0;
  const yearOutput = yearResult.data?.[0]?.output_tokens || 0;

  if (minuteInput > 500000 || minuteOutput > 500000) {
    return NextResponse.json(
      { error: "Minute limit exceeded" },
      { status: 429 }
    );
  }

  if (hourInput > 500000 || hourOutput > 500000) {
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
