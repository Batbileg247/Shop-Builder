import { getAuthSession } from "@/lib/auth-session";
import { assertShopBuilderApiConfigured } from "@/lib/env";

export class ShopBuilderApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "ShopBuilderApiError";
    this.status = status;
    this.body = body;
  }
}

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function shopBuilderFetch<T = Json>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const base = assertShopBuilderApiConfigured();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const session = typeof window !== "undefined" ? getAuthSession() : null;
  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }
  const res = await fetch(url, {
    ...init,
    headers,
    body:
      init.json !== undefined
        ? JSON.stringify(init.json)
        : (init.body ?? undefined),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = text ? (JSON.parse(text) as { error?: string; message?: string }) : {};
      if (typeof j.error === "string" && j.error) msg = j.error;
      else if (typeof j.message === "string" && j.message) msg = j.message;
    } catch {
      if (text) msg = text.slice(0, 200);
    }
    throw new ShopBuilderApiError(msg, res.status, text);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
