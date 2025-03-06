export async function generateIcon(uuid: string, title: string) {
  const body = JSON.stringify({
    uuid,
    title,
  });

  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SWIFTBITE_API_KEY}`,
  };

  const response = await fetch(
    "https://swiftbite.dev.hedium.nl/generate-icon",
    {
      body,
      method,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate icon");
  }
}
