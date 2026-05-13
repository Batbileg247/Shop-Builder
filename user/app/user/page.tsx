"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  clearAuthSession,
  getAuthSession,
  type AuthSession,
} from "@/lib/auth-session";

export default function UserAccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const s = getAuthSession();
    if (!s) {
      router.replace("/signin?redirect=%2Fuser");
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-400">
        Ачааллаж байна…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col gap-6 bg-zinc-950 px-6 py-16 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Миний бүртгэл</h1>
      <dl className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-sm">
        {(session.user.lastName || session.user.firstName) && (
          <div>
            <dt className="text-zinc-500">Овог, нэр</dt>
            <dd className="font-medium">
              {[session.user.lastName, session.user.firstName]
                .filter(Boolean)
                .join(" ")}
            </dd>
          </div>
        )}
        {session.user.phone && (
          <div>
            <dt className="text-zinc-500">Утас</dt>
            <dd className="font-medium">{session.user.phone}</dd>
          </div>
        )}
        <div>
          <dt className="text-zinc-500">И-мэйл</dt>
          <dd className="font-medium">{session.user.email}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Эрх</dt>
          <dd className="font-medium">{session.user.role}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">ID</dt>
          <dd className="break-all font-mono text-xs text-zinc-400">
            {session.user.id}
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/builder"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900"
        >
          Builder руу
        </Link>
        <button
          type="button"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
          onClick={() => {
            clearAuthSession();
            router.push("/signin");
            router.refresh();
          }}
        >
          Гарах
        </button>
        <Link href="/" className="rounded-lg px-4 py-2 text-sm text-zinc-400">
          Нүүр
        </Link>
      </div>
    </div>
  );
}
