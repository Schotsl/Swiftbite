import { StreamObjectResult } from "ai";

export const handleError = (error: Error | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const roundNumber = (number: number, precision = 2) => {
  const factor = Math.pow(10, precision);
  const rounded = Math.round(number * factor);

  return rounded / factor;
};

export const streamToResponse = <T>(
  stream: StreamObjectResult<T[], T[], AsyncIterable<T> & ReadableStream<T>>,
): Response => {
  const { partialObjectStream } = stream;

  const headers = {
    "Content-Type": "application/json",
    "Transfer-Encoding": "chunked",
  };

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of partialObjectStream) {
        const stringified = JSON.stringify(chunk);

        controller.enqueue(stringified);
      }

      controller.close();
    },
  });

  return new Response(readable, { headers });
};
