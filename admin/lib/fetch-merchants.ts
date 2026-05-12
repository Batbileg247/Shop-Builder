import { getAxiosPayload, platformClient } from "@/lib/api-client";
import {
  extractArrayFromUnknown,
  getApiErrorFromBody,
} from "@/lib/normalize-api-response";

export type MerchantDisplay = {
  id: string;
  email: string;
  role: "merchant" | "admin";
  status: "Paid" | "Active";
};

export type MerchantsFetchResult = {
  list: MerchantDisplay[];
  error: null | "api";
};

function normalizeMerchant(raw: unknown): MerchantDisplay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  const email = r.email != null ? String(r.email) : "";
  if (!id) return null;

  const roleRaw = String(r.role ?? "merchant").toLowerCase();
  const role: "merchant" | "admin" = roleRaw === "admin" ? "admin" : "merchant";

  const statusRaw = String(
    r.status ?? r.plan ?? r.subscriptionStatus ?? "active",
  ).toLowerCase();
  const status: "Paid" | "Active" =
    statusRaw === "paid" || statusRaw === "premium" ? "Paid" : "Active";

  return {
    id,
    email: email || "—",
    role,
    status,
  };
}

/** GET /admin/merchants — password/hash UI-д орохгүй. */
export async function fetchMerchants(): Promise<MerchantsFetchResult> {
  try {
    const res = await platformClient.get<unknown>("/admin/merchants");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) {
      console.error("[fetchMerchants] API error:", apiErr);
      return { list: [], error: "api" };
    }
    const list = extractArrayFromUnknown(raw);

    const mapped = list
      .map(normalizeMerchant)
      .filter((m): m is MerchantDisplay => m !== null);
    return { list: mapped, error: null };
  } catch (err) {
    console.error("[fetchMerchants] Request failed:", err);
    return { list: [], error: "api" };
  }
}
