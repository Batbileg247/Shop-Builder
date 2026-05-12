import { getAxiosPayload, platformClient } from "@/lib/api-client";
import {
  extractArrayFromUnknown,
  getApiErrorFromBody,
} from "@/lib/normalize-api-response";

export type StoreDisplay = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  themeConfig: unknown;
  detail: Record<string, unknown>;
};

export type StoresFetchResult = {
  list: StoreDisplay[];
  error: null | "api";
};

function stripSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };
  delete out.password;
  delete out.passwordHash;
  delete out.password_hash;
  return out;
}

function normalizeStore(raw: unknown): StoreDisplay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  if (!id) return null;

  const name = r.name != null ? String(r.name) : "Untitled store";
  const slug = r.slug != null ? String(r.slug) : "";
  const ownerId =
    r.ownerId != null
      ? String(r.ownerId)
      : r.owner_id != null
        ? String(r.owner_id)
        : "";

  const themeConfig = r.themeConfig ?? r.theme_config ?? {};

  return {
    id,
    name,
    slug,
    ownerId: ownerId || "—",
    themeConfig,
    detail: stripSensitive(r),
  };
}

export async function fetchStores(): Promise<StoresFetchResult> {
  try {
    const res = await platformClient.get<unknown>("/admin/stores");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) {
      console.error("[fetchStores] API error:", apiErr);
      return { list: [], error: "api" };
    }
    const list = extractArrayFromUnknown(raw);

    const mapped = list
      .map(normalizeStore)
      .filter((s): s is StoreDisplay => s !== null);
    return { list: mapped, error: null };
  } catch (err) {
    console.error("[fetchStores] Request failed:", err);
    return { list: [], error: "api" };
  }
}

export function getStorePrimaryColor(themeConfig: unknown): string {
  if (!themeConfig || typeof themeConfig !== "object") return "#111827";
  const t = themeConfig as Record<string, unknown>;
  const colors = t.colors;
  if (colors && typeof colors === "object") {
    const primary = (colors as Record<string, unknown>).primary;
    if (typeof primary === "string" && primary.trim()) return primary.trim();
  }
  if (typeof t.primary === "string" && t.primary.trim()) return t.primary.trim();
  return "#111827";
}
