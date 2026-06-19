import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { recoverJson } from "@/lib/json-recovery";

const LLM_API_KEY = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
const LLM_BASE_URL =
  process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1";
const LLM_MODEL =
  process.env.LLM_MODEL || "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topics, hoursPerDay, examDate } = body;

    // Validate inputs
    if (!subject || !topics || !hoursPerDay || !examDate) {
      return NextResponse.json(
        { error: "All fields are required: subject, topics, hoursPerDay, examDate." },
        { status: 400 }
      );
    }

    if (!LLM_API_KEY || LLM_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        {
          error:
            "LLM API key is not configured. Set GROQ_API_KEY in your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate + "T00:00:00");
    const daysRemaining = Math.max(
      1,
      Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Build prompts
    const userPrompt = buildUserPrompt({
      subject,
      topics,
      hoursPerDay: Number(hoursPerDay),
      examDate,
      daysRemaining,
    });

    // Call LLM
    const llmResponse = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text().catch(() => "Unknown error");
      console.error("LLM API error:", llmResponse.status, errText);

      if (llmResponse.status === 401 || llmResponse.status === 403) {
        return NextResponse.json(
          { error: "Invalid API key. Check your GROQ_API_KEY in .env.local." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Failed to generate study plan. The AI service is temporarily unavailable. Please try again.",
        },
        { status: 502 }
      );
    }

    const data = await llmResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    // Parse and validate the JSON response
    let parsed: { schedule?: unknown };
    try {
      parsed = recoverJson(rawContent) as { schedule?: unknown };
    } catch (e) {
      return NextResponse.json(
        {
          error:
            e instanceof Error
              ? e.message
              : "Failed to parse the AI-generated study plan. Please try again.",
        },
        { status: 500 }
      );
    }

    if (!parsed.schedule || !Array.isArray(parsed.schedule)) {
      return NextResponse.json(
        {
          error:
            "The AI response did not include a valid schedule. Please try again.",
        },
        { status: 500 }
      );
    }

    // Return the plan
    return NextResponse.json({
      subject,
      topics,
      hoursPerDay: Number(hoursPerDay),
      examDate,
      schedule: parsed.schedule,
    });
  } catch (e) {
    console.error("Unexpected error in /api/generate:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
