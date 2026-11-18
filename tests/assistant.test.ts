import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/assistant/route";

const makeRequest = (body: string, ip: string, includeOrigin = true) => new Request("http://localhost/api/assistant", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-forwarded-for": ip,
    ...(includeOrigin ? { origin: "http://localhost" } : {})
  },
  body
});

afterEach(() => vi.unstubAllEnvs());

describe("creative assistant endpoint safeguards", () => {
  it("rejects requests without a same-origin browser header", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const response = await POST(makeRequest(JSON.stringify({ prompt: "A brief" }), "198.51.100.1", false));
    expect(response.status).toBe(403);
  });

  it("returns a setup response when the server key is missing", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const response = await POST(makeRequest(JSON.stringify({ prompt: "A brief" }), "198.51.100.2"));
    expect(response.status).toBe(503);
  });

  it("rejects malformed JSON before contacting the provider", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const response = await POST(makeRequest("{", "198.51.100.3"));
    expect(response.status).toBe(400);
  });

  it("rejects oversized prompts", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const response = await POST(makeRequest(JSON.stringify({ prompt: "x".repeat(5001) }), "198.51.100.4"));
    expect(response.status).toBe(413);
  });
});
