import { getPlatformApiBase } from "@/lib/platform-auth";

export type PlatformStoreCreated = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  themeConfig?: unknown;
};

/**
 * Platform worker `POST /stores` — D1 дээр шинэ дэлгүүр (merchant admin жагсаалтад орно).
 */
export async function postPlatformStore(
  input: {
    ownerId: string;
    name: string;
    slug: string;
    themeConfig?: Record<string, unknown>;
  },
  opts?: { signal?: AbortSignal },
): Promise<PlatformStoreCreated> {
  const base = getPlatformApiBase();
  const res = await fetch(`${base}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ownerId: input.ownerId.trim(),
      name: input.name.trim(),
      slug: input.slug.trim(),
      ...(input.themeConfig && Object.keys(input.themeConfig).length > 0
        ? { themeConfig: input.themeConfig }
        : {}),
    }),
    signal: opts?.signal,
  });
  const data = (await res.json().catch(() => null)) as
    | PlatformStoreCreated
    | { error?: string }
    | null;
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `Дэлгүүр үүсгэхэд алдаа (${res.status})`;
    throw new Error(msg);
  }
  if (
    !data ||
    typeof data !== "object" ||
    typeof (data as PlatformStoreCreated).id !== "string"
  ) {
    throw new Error("Серверээс дэлгүүрийн id ирээгүй.");
  }
  return data as PlatformStoreCreated;
}
