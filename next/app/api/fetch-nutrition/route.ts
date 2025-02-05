import { fetchEstimation } from "../../../services/openai";

export async function POST(request: Request) {
  const { image } = await request.json();

  const responseData = await fetchEstimation(image);
  const responseParsed = JSON.stringify({ nutrition: responseData });

  return new Response(responseParsed, { status: 200 });
}
