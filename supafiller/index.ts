import productPrompt from "./prompt";

import { google } from "@ai-sdk/google";
import { supabase } from "./supabase";
import { generateText } from "ai";
import { readFileSync, writeFileSync, existsSync } from "fs";

const PRODUCTS_FILE = "searched.txt";

// Function to read existing products from file
function getExisting(): string[] {
  if (!existsSync(PRODUCTS_FILE)) {
    return [];
  }

  const content = readFileSync(PRODUCTS_FILE, "utf-8");
  const products = content.split("\n").filter((line) => line.trim() !== "");

  return products;
}

// Function to write a new product to the file
function writeProduct(product: string): void {
  const existingProducts = getExisting();
  const exists = existingProducts.includes(product);

  if (exists) {
    return;
  }

  const content = existingProducts.length > 0 ? `\n${product}` : product;

  writeFileSync(PRODUCTS_FILE, content, { flag: "a" });
}

async function getGrounding() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("usage")
    .select("*")
    .eq("grounding", true)
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lt("created_at", `${today}T23:59:59.999Z`);

  if (error) {
    throw error;
  }

  return data.length;
}

async function getProduct(): Promise<string> {
  const existingProducts = getExisting();
  const existingProductsText =
    existingProducts.length > 0
      ? `\n\nProducts already searched (avoid these): ${existingProducts.join(
          ", "
        )}`
      : "";

  const model = google("gemini-2.5-pro-preview-05-06", {
    useSearchGrounding: true,
  });

  const { text } = await generateText({
    model,
    temperature: 1,
    messages: [
      {
        role: "system",
        content: productPrompt + existingProductsText,
      },
      {
        role: "user",
        content: "Generate one random Dutch supermarket product name",
      },
    ],
  });

  return text.trim();
}

async function searchProduct(product: string) {
  const headers = {
    "X-Supabase-Secret": process.env.SWIFTBITE_API_KEY!,
    "Content-Type": "application/json",
  };

  const params = new URLSearchParams({
    lang: "nl",
    type: "search_product",
    query: product,
  });

  const response = await fetch(
    `${process.env.SWIFTBITE_API_URL}/api/ai/search?${params.toString()}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw response.statusText;
  }

  // Consume the response body
  if (response.body) {
    const reader = response.body.getReader();

    try {
      while (true) {
        const { done } = await reader.read();

        if (done) break;
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// Main execution loop
async function main() {
  console.log("Starting product search loop...");

  while (true) {
    console.log("\n--------------------------------");

    const groundingUsage = await getGrounding();
    console.log(`Current grounding usage: ${groundingUsage}`);

    if (groundingUsage >= 500) {
      console.log("Grounding usage has reached 500");

      break;
    }

    const product = await getProduct();
    console.log(`Generated product: ${product}`);

    console.log("Searching product");

    await searchProduct(product);
    console.log("Product search completed successfully");

    writeProduct(product);
  }
}

main();
