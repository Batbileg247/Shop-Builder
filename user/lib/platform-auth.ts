import type { AuthSession, AuthUser } from "@/lib/auth-session";

function normalizeBaseUrl(url: string | undefined): string | null {
  if (url == null || url === "") return null;
  let u = url.trim();
  if (/^\/+(https?:\/\/)/i.test(u)) {
    u = u.replace(/^\/+/, "");
  }
  u = u.endsWith("/") ? u.slice(0, -1) : u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

export function getPlatformApiBase(): string {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_PLATFORM_API_URL);
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_PLATFORM_API_URL тохируулаагүй эсвэл буруу байна.",
    );
  }
  return base;
}

/** Root GET-ээр Platform API эсэхийг шалгана (Merchant URL буруу оруулсан эсэх). */
async function assertPlatformApiReachable(base: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${base}/`, { method: "GET", cache: "no-store" });
  } catch (e) {
    throw new Error(
      `Platform API (${base}) руу холбогдож чадсангүй. Сервер асаалттай эсэхийг шалгана уу. ${e instanceof Error ? e.message : ""}`,
    );
  }
  const text = await res.text();
  let service: string | undefined;
  try {
    const j = text.length ? (JSON.parse(text) as { service?: string }) : {};
    service = j.service;
  } catch {
    throw new Error(
      `API суурь (${base}) JSON биш хариу өгч байна — URL буруу эсвэл өөр апп байж магадгүй. Эхлэл: ${text.slice(0, 100)}`,
    );
  }
  if (service === "merchant-api") {
    throw new Error(
      "NEXT_PUBLIC_PLATFORM_API_URL нь Merchant API байна. Platform worker-ийн хаягыг ашиглана уу (GET / нь { \"service\": \"platform-api\" } буцах ёстой).",
    );
  }
  if (service !== "platform-api") {
    throw new Error(
      `Суурь URL Platform API биш байна (service: ${String(service)}). apps/platform-api-ийг асааж, зөв порт/URL-ыг .env-д бичнэ үү.`,
    );
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const data = text.length ? (JSON.parse(text) as { error?: string }) : null;
    if (data && typeof data.error === "string" && data.error.length > 0) {
      return data.error;
    }
  } catch {
    /* ignore */
  }
  if (text.trim().length > 0) {
    return `Алдаа (${res.status}): ${text.slice(0, 200)}`;
  }
  return `Алдаа (${res.status})`;
}

function unwrapPayload(
  root: Record<string, unknown>,
): Record<string, unknown> {
  const inner = root.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return root;
}

function parseAuthSessionFromPayload(data: unknown): AuthSession {
  if (!data || typeof data !== "object") {
    throw new Error("Серверийн хариу хоосон эсвэл объект биш байна.");
  }
  const root = data as Record<string, unknown>;
  const o = unwrapPayload(root);

  const tokenRaw =
    o.token ?? o.accessToken ?? o.access_token ?? o.jwt;
  const token =
    typeof tokenRaw === "string" && tokenRaw.length > 0 ? tokenRaw : null;

  let userRaw: unknown = o.user;

  if (
    !userRaw &&
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    o.role !== undefined &&
    o.role !== null
  ) {
    userRaw = { id: o.id, email: o.email, role: o.role };
  }

  if (!token) {
    const keys = Object.keys(o).join(", ");
    throw new Error(
      keys
        ? `Сервер token буцаасангүй (талбарууд: ${keys}). Ихэвчлэн шалтгаан: (1) Platform worker хуучин хувилбар — Unlimited-team-Backend дотор \`npm run dev:platform\` эсвэл deploy хийгээрэй; (2) Cloudflare дээр JWT_SECRET secret тохируулаагүй.`
        : "Сервер token буцаасангүй. Platform API-аа шинэчлэн асаана уу.",
    );
  }

  if (!userRaw || typeof userRaw !== "object" || Array.isArray(userRaw)) {
    throw new Error("Серверийн хариуд `user` объект шаардлагатай.");
  }

  const u = userRaw as Record<string, unknown>;
  const id = typeof u.id === "string" ? u.id : undefined;
  const email = typeof u.email === "string" ? u.email : undefined;
  const role =
    u.role !== undefined && u.role !== null ? String(u.role) : undefined;

  if (!id || !email || !role) {
    throw new Error(
      "Серверийн `user` дотор `id`, `email`, `role` (текст) байх ёстой.",
    );
  }

  const user: AuthUser = { id, email, role };
  const fn = u.firstName ?? u.first_name;
  const ln = u.lastName ?? u.last_name;
  const ph = u.phone;
  if (typeof fn === "string" && fn.trim()) user.firstName = fn.trim();
  if (typeof ln === "string" && ln.trim()) user.lastName = ln.trim();
  if (typeof ph === "string" && ph.trim()) user.phone = ph.trim();
  return { token, user };
}

async function parseAuthSessionResponse(res: Response): Promise<AuthSession> {
  const text = await res.text();
  let data: unknown;
  try {
    data = text.length ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Серверийн хариу JSON биш. NEXT_PUBLIC_PLATFORM_API_URL зөв platform worker руу зааж байгаа эсэхийг шалгана уу. Эхлэл: ${text.slice(0, 120)}`,
    );
  }
  return parseAuthSessionFromPayload(data);
}

const authFetchInit: RequestInit = {
  cache: "no-store",
  credentials: "omit",
};

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<AuthSession> {
  const base = getPlatformApiBase();
  await assertPlatformApiReachable(base);
  const res = await fetch(`${base}/auth/login`, {
    ...authFetchInit,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return parseAuthSessionResponse(res);
}

export type RegisterProfile = {
  firstName: string;
  lastName: string;
  phone: string;
};

export async function registerMerchant(
  email: string,
  password: string,
  profile: RegisterProfile,
): Promise<AuthSession> {
  const base = getPlatformApiBase();
  await assertPlatformApiReachable(base);
  const res = await fetch(`${base}/auth/register`, {
    ...authFetchInit,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      password,
      role: "merchant",
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: profile.phone.trim(),
    }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return parseAuthSessionResponse(res);
}
