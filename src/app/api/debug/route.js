import { NextResponse } from "next/server";
import dns from "dns";

/*
  Dev-only diagnostics endpoint.
  GET  /api/debug
  Returns DNS lookup for accounts.google.com, a timed fetch to Google's OIDC config,
  and relevant proxy env vars. Use this to confirm whether your Next.js server can
  reach Google (helps debug the ETIMEDOUT / AggregateError you saw).
*/
export async function GET() {
  // Prevent enabling this in production accidentally
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  const result = {};
  const start = Date.now();

  // DNS lookup
  try {
    const lookup = await dns.promises.lookup("accounts.google.com");
    result.dns = { ok: true, lookup };
  } catch (err) {
    result.dns = { ok: false, error: err.message };
  }

  // Timed fetch to Google's OIDC endpoint
  const controller = new AbortController();
  const timeoutMs = 5000;
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://accounts.google.com/.well-known/openid-configuration", {
      method: "GET",
      signal: controller.signal,
    });
    const text = await res.text();
    result.fetch = {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      length: text.length,
    };
  } catch (err) {
    result.fetch = { ok: false, error: err.message };
  } finally {
    clearTimeout(id);
  }

  // Proxy / network environment variables
  result.env = {
    HTTP_PROXY: process.env.HTTP_PROXY || process.env.http_proxy || null,
    HTTPS_PROXY: process.env.HTTPS_PROXY || process.env.https_proxy || null,
    NO_PROXY: process.env.NO_PROXY || process.env.no_proxy || null,
  };

  result.tookMs = Date.now() - start;

  return NextResponse.json(result);
}
