import { getAxiosPayload, merchantClient } from "@/lib/api-client";
import {
  getApiErrorFromBody,
  unwrapAxiosData,
} from "@/lib/normalize-api-response";

export type AdminStats = {
  totalMerchants: number;
  totalStores: number;
  totalProducts: number;
};

export type AdminStatsFetchResult = {
  stats: AdminStats | null;
  error: null | "api" | "no_data";
};

function parseAdminStats(body: unknown): AdminStats | null {
  if (body === null || body === undefined) return null;
  if (typeof body !== "object" || Array.isArray(body)) return null;
  let o = body as Record<string, unknown>;
  const nested = o.stats ?? o.payload ?? o.body;
  if (
    nested &&
    typeof nested === "object" &&
    !Array.isArray(nested) &&
    ("totalMerchants" in nested ||
      "totalStores" in nested ||
      "totalProducts" in nested ||
      "total_merchants" in nested)
  ) {
    o = nested as Record<string, unknown>;
  }
  const tm = o.totalMerchants ?? o.total_merchants;
  const ts = o.totalStores ?? o.total_stores;
  const tp = o.totalProducts ?? o.total_products;
  if (tm === undefined && ts === undefined && tp === undefined) return null;
  return {
    totalMerchants: Number(tm ?? 0),
    totalStores: Number(ts ?? 0),
    totalProducts: Number(tp ?? 0),
  };
}

export async function fetchAdminStats(): Promise<AdminStatsFetchResult> {
  try {
    const res = await merchantClient.get<unknown>("/admin/stats");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) {
      console.error("[fetchAdminStats] API error:", apiErr);
      return { stats: null, error: "api" };
    }
    const body = unwrapAxiosData(raw);

    const stats = parseAdminStats(body);
    if (!stats) {
      console.error(
        "[fetchAdminStats] No parsable stats. Raw / unwrapped:",
        raw,
        body,
      );
      return { stats: null, error: "no_data" };
    }
    return { stats, error: null };
  } catch (err) {
    console.error("[fetchAdminStats] Request failed:", err);
    return { stats: null, error: "api" };
  }
}
