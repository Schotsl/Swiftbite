export const fetchTitle = async (image: string) => {
  console.log("[API] Fetching title...");

  const url = "https://swiftbite.app/api/fetch-title";
  const body = JSON.stringify({ image });
  const method = "POST";

  const response = await fetch(url, { body, method });

  if (!response.ok) {
    console.log(`API request failed with status ${response.status}`);

    throw new Error(`API request failed with status ${response.status}`);
  }

  const parsed = await response.json();

  console.log("[API] Received title");

  return parsed.title;
};

export const fetchNutrition = async (image: string) => {
  console.log("[API] Fetching nutrition...");

  const url = "https://swiftbite.app/api/fetch-nutrition";
  const body = JSON.stringify({ image });
  const method = "POST";

  const response = await fetch(url, { body, method });

  if (!response.ok) {
    console.log(`API request failed with status ${response.status}`);

    throw new Error(`API request failed with status ${response.status}`);
  }

  const parsed = await response.json();

  console.log("[API] Received nutrition");

  return parsed.nutrition;
};
