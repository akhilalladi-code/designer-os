import { NextResponse } from "next/server";

export const runtime = "nodejs";
const MAX_PROMPT = 5000;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
// Best-effort per-process throttling. Production deployments should also use
// platform-level rate limiting and authentication for public AI access.
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Requests must originate from this application." }, { status: 403 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const current = rateLimits.get(clientIp);
  if (current && current.resetAt > now && current.count >= MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json({ error: "Too many AI requests. Wait a minute and try again." }, { status: 429 });
  }
  if (!current || current.resetAt <= now) rateLimits.set(clientIp, { count: 1, resetAt: now + RATE_WINDOW_MS });
  else rateLimits.set(clientIp, { count: current.count + 1, resetAt: current.resetAt });
  if (rateLimits.size > 1000) {
    for (const [ip, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(ip);
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "AI assistant is not configured yet. Add OPENAI_API_KEY to your server environment to enable it." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object" || !("prompt" in body) || typeof body.prompt !== "string") return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  const prompt = body.prompt.trim();
  if (!prompt) return NextResponse.json({ error: "Enter a brief before generating." }, { status: 400 });
  if (prompt.length > MAX_PROMPT) return NextResponse.json({ error: "Prompt is too long. Keep it under 5,000 characters." }, { status: 413 });
  const brand = "brand" in body && body.brand && typeof body.brand === "object" ? body.brand as Record<string, unknown> : {};
  const context = {
    name: typeof brand.name === "string" ? brand.name.slice(0,100) : "",
    colors: Array.isArray(brand.colors) ? brand.colors.filter((v): v is string => typeof v === "string").slice(0,12) : [],
    headingFont: typeof brand.headingFont === "string" ? brand.headingFont.slice(0,80) : "",
    bodyFont: typeof brand.bodyFont === "string" ? brand.bodyFont.slice(0,80) : ""
  };
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "You are a senior creative director supporting a graphic designer. Turn the user's brief into practical, distinctive creative direction. Structure the response with: strategic idea, audience insight, visual concept, color direction, typography direction, layout/composition, deliverable checklist, and production considerations. Be specific, avoid generic filler, and call out assumptions. Do not claim to create files or assets.",
        input: `Brand context (user-provided): ${JSON.stringify(context)}\n\nCreative brief:\n${prompt}`,
        max_output_tokens: 1200
      }),
      signal: AbortSignal.timeout(45000)
    });
    const data = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }>; error?: { message?: string } };
    if (!response.ok) return NextResponse.json({ error: response.status === 401 ? "The configured AI key was rejected. Check OPENAI_API_KEY on the server." : data.error?.message || "The AI provider could not complete this request." }, { status: response.status === 429 ? 429 : 502 });
    const answer = data.output?.flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text || "").join("\n").trim();
    if (!answer) return NextResponse.json({ error: "The provider returned no text. Please try again." }, { status: 502 });
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "The AI request timed out. Please try again." : "Could not reach the AI provider. Check server connectivity and try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
