/**
 * Web search tool — searches DuckDuckGo for course syllabus topics.
 *
 * Uses DuckDuckGo's HTML search (no API key required).
 * Extracts text snippets from search result pages and returns
 * them as a single string for further processing by the LLM.
 */

const SEARCH_URL = "https://html.duckduckgo.com/html/";

export interface SearchResult {
  /** Combined text from all result snippets on the first page. */
  text: string;
  /** The raw snippet texts found. */
  snippets: string[];
}

/**
 * Search DuckDuckGo for course topics. Returns extracted snippet text.
 * The search query appends "syllabus topics" to improve results.
 */
export async function searchCourseTopics(
  courseName: string
): Promise<SearchResult> {
  const query = `${courseName} syllabus topics`;
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PrepWiseAI/1.0; educational project)",
      Accept: "text/html",
    },
    // Avoid hanging indefinitely
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `Web search returned status ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const snippets = extractSnippets(html);

  if (snippets.length === 0) {
    throw new Error("No search results found for this course.");
  }

  return {
    text: snippets.join("\n\n"),
    snippets,
  };
}

/**
 * Extract result snippet text from DuckDuckGo HTML search results.
 * Matches <a class="result__snippet">...</a> elements.
 */
function extractSnippets(html: string): string[] {
  // DuckDuckGo result snippets are in <a class="result__snippet">
  // The pattern matches the inner HTML content.
  const snippetRegex = /<a\s+[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  const snippets: string[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = snippetRegex.exec(html)) !== null) {
    // Strip HTML tags from snippet text
    const raw = match[1].replace(/<[^>]+>/g, " ").trim();
    // Collapse whitespace
    const clean = raw.replace(/\s+/g, " ");
    if (clean.length > 10 && !seen.has(clean)) {
      seen.add(clean);
      snippets.push(clean);
    }
  }

  return snippets;
}
