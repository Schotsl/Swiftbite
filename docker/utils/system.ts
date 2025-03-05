export async function removeBackground(input: string, output: string) {
  const command = `backgroundremover --input /app/${input} --output ${output}`;
  const process = Bun.spawn({
    cmd: ["sh", "-c", command],
    stdout: "pipe",
    stderr: "pipe",
  });

  await process.exited;
}

export async function trimImage(input: string, output: string) {
  const command = `convert ${input} -fuzz 2% -trim ${output}`;
  const process = Bun.spawn({
    cmd: ["sh", "-c", command],
    stdout: "pipe",
    stderr: "pipe",
  });

  await process.exited;
}

export async function resizeImage(input: string, output: string) {
  const command = `convert ${input} -resize 128x128 ${output}`;
  const process = Bun.spawn({
    cmd: ["sh", "-c", command],
    stdout: "pipe",
    stderr: "pipe",
  });

  await process.exited;
}
