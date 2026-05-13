"use client";

import { AUTH_LOGGED_IN_COOKIE } from "@/lib/auth-cookie";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = "shop-user-auth";

function setLoggedInCookie() {
  document.cookie = `${AUTH_LOGGED_IN_COOKIE}=1; Path=/; Max-Age=604800; SameSite=Lax`;
}

function clearLoggedInCookie() {
  document.cookie = `${AUTH_LOGGED_IN_COOKIE}=; Path=/; Max-Age=0`;
}

export { AUTH_LOGGED_IN_COOKIE } from "@/lib/auth-cookie";

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const { token, user } = parsed as AuthSession;
    if (
      typeof token !== "string" ||
      !user ||
      typeof user !== "object" ||
      typeof user.id !== "string" ||
      typeof user.email !== "string" ||
      typeof user.role !== "string"
    ) {
      return null;
    }
    const u = user as Record<string, unknown>;
    const out: AuthUser = {
      id: u.id as string,
      email: u.email as string,
      role: u.role as string,
    };
    if (typeof u.firstName === "string" && u.firstName) {
      out.firstName = u.firstName;
    } else if (typeof u.first_name === "string" && u.first_name) {
      out.firstName = u.first_name;
    }
    if (typeof u.lastName === "string" && u.lastName) {
      out.lastName = u.lastName;
    } else if (typeof u.last_name === "string" && u.last_name) {
      out.lastName = u.last_name;
    }
    if (typeof u.phone === "string" && u.phone) {
      out.phone = u.phone;
    }
    return { token, user: out };
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  setLoggedInCookie();
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  clearLoggedInCookie();
}

/** localStorage-д session байвал cookie-г нөхөн тохируулна (middleware-д зориулсан). */
export function ensureAuthCookieFromSession(): void {
  if (typeof window === "undefined") return;
  if (getAuthSession()) setLoggedInCookie();
}
