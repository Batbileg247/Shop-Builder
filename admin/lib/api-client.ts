import axios, { AxiosError, type AxiosInstance } from "axios";

/**
 * Зарим тохиолдолд body `res.data` дотор, заримдаа шууд ирнэ гэж үзнэ.
 * Axios: ихэвчлэн `response.data` л ашиглагдана.
 */
export function getAxiosPayload(res: { data?: unknown }): unknown {
  const d = res.data;
  if (d !== undefined && d !== null) return d;
  return res;
}

/** .env-д санамсаргүй `//https://...` бичигдсэн тохиолдлыг засна. */
function normalizeBaseUrl(url: string | undefined): string | undefined {
  if (url == null || url === "") return undefined;
  let u = url.trim();
  if (/^\/+(https?:\/\/)/i.test(u)) {
    u = u.replace(/^\/+/, "");
  }
  u = u.endsWith("/") ? u.slice(0, -1) : u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return u;
  } catch {
    return undefined;
  }
}

const MISSING_BASE = "MISSING_API_BASE_URL";

function createApiClient(
  getEnvUrl: () => string | undefined,
  label: string,
): AxiosInstance {
  const client = axios.create({
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const base = normalizeBaseUrl(getEnvUrl());
    if (!base) {
      if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
        console.error(
          `[api-client] ${label}: NEXT_PUBLIC_*_API_URL тохируулаагүй эсвэл буруу URL — admin/.env.local үүсгээд жишээг backend-book.md-аас хуулна уу.`,
        { raw: getEnvUrl() },
      );
      }
      return Promise.reject(
        new AxiosError(
          `[api-client] ${label}: API суурь хаяг (base URL) алга.`,
          MISSING_BASE,
          config,
        ),
      );
    }
    config.baseURL = base;

    const secret = process.env.ADMIN_SECRET;
    if (secret) {
      config.headers.set("x-admin-secret", secret);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      console.log("API Result:", response.data);
      return response;
    },
    (error: unknown) => {
      const code = error instanceof AxiosError ? error.code : undefined;
      if (code === MISSING_BASE) {
        console.error(
          "API Result (error):",
          "NEXT_PUBLIC_PLATFORM_API_URL / NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй эсвэл буруу.",
        );
      } else {
        console.error(
          "API Result (error):",
          error instanceof AxiosError
            ? (error.response?.data ?? error.message)
            : error,
        );
      }
      return Promise.reject(error);
    },
  );

  return client;
}

/** Platform: auth, stores, GET /admin/merchants, GET /admin/stores */
export const platformClient = createApiClient(
  () => process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  "platformClient",
);

/** Merchant: products, upload, GET /admin/stats, GET /admin/products */
export const merchantClient = createApiClient(
  () => process.env.NEXT_PUBLIC_MERCHANT_API_URL,
  "merchantClient",
);
