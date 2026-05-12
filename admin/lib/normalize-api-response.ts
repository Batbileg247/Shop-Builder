/**
 * Cloudflare Workers / axios: body нь шууд массив эсвэл { data: ... } давхаргатай ирж болно.
 */
export function unwrapAxiosData(data: unknown, maxDepth = 8): unknown {
  let cur: unknown = data;
  let depth = 0;
  while (
    depth < maxDepth &&
    cur !== null &&
    cur !== undefined &&
    typeof cur === "object" &&
    !Array.isArray(cur)
  ) {
    const o = cur as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(o, "data")) break;
    const next = o.data;
    if (next === undefined) break;
    cur = next;
    depth += 1;
  }
  return cur;
}

const ARRAY_KEYS = [
  "merchants",
  "stores",
  "users",
  "products",
  "items",
  "results",
  "result",
  "records",
  "payload",
  "list",
  "rows",
] as const;

/** Backend ихэвчлэн `{ "error": "..." }` буцаана — HTTP 200 үед ч байж болно. */
export function getApiErrorFromBody(payload: unknown): string | null {
  const u = unwrapAxiosData(payload);
  if (!u || typeof u !== "object" || Array.isArray(u)) return null;
  const e = (u as Record<string, unknown>).error;
  return typeof e === "string" && e.trim() ? e.trim() : null;
}

export function extractArrayFromUnknown(payload: unknown): unknown[] {
  const u = unwrapAxiosData(payload);
  if (Array.isArray(u)) return u;
  if (u && typeof u === "object") {
    const o = u as Record<string, unknown>;
    for (const key of ARRAY_KEYS) {
      const v = o[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}
