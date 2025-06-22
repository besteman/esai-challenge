import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const {
    prompt,
    system,
    model,
  }: { prompt: string; system: string; model: string } = await req.json();

  const { text } = await generateText({
    model: openai(model || "gpt-4.1-nano"),
    system,
    prompt,
  });

  return Response.json({ text });
}
