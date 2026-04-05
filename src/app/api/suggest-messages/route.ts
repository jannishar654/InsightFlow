import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";

export async function POST(req: Request) {
  try{
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const result = streamText({
    model: google("gemini-1.5-flash"),
    prompt,
  });

  return result.toTextStreamResponse(); 
  }  catch (error: unknown) {

  if (error instanceof Error) {
    const err = error as any; 

    const name = err.name || "Error";
    const message = err.message || "Something went wrong";
    const status = err.status || err.statusCode || 500;
    const headers = err.headers || {};

    return Response.json(
      {
        name,
        status,
        headers,
        message,
      },
      { status }
    );

  } else {
    console.error("An unexpected error occurred:", error);

    return Response.json(
      {
        name: "UnknownError",
        status: 500,
        headers: {},
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
}