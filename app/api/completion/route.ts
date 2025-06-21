import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt, system }: { prompt: string; system: string } =
    await req.json();

  const { text } = await generateText({
    model: openai("gpt-4.1-nano"),
    system,
    prompt,
  });

  return Response.json({ text });
}
