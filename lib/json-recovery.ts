/**
 * Strips markdown code fences (```json ... ```) from an LLM response
 * and attempts to parse the remaining text as JSON.
 *
 * Handles common edge cases:
 * - Triple backtick fences with and without language specifiers
 * - Leading/trailing whitespace
 * - JSON embedded in surrounding text
 */
export function recoverJson(raw: string): unknown {
  let text = raw.trim();

  // Remove markdown code fences: ```json ... ``` or ``` ... ```
  const fencePattern = /^```(?:json)?\s*\n([\s\S]*?)\n```$/;
  const fenceMatch = text.match(fencePattern);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Try to parse directly
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: find a JSON object (balanced braces) in the text
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error(
        "The AI response did not contain valid JSON. Please try again."
      );
    }

    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      throw new Error(
        "Failed to parse the AI-generated study plan. The response format was unexpected. Please try again."
      );
    }
  }
}
