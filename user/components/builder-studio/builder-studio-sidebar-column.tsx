"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BuilderEditorSidebar } from "@/components/builder-studio/builder-editor-sidebar";
import { getAuthSession, type AuthSession } from "@/lib/auth-session";
import { PATHS } from "@/lib/site-paths";

function initialsFor(session: AuthSession) {
  const name =
    [session.user.lastName, session.user.firstName]
      .filter(Boolean)
      .join(" ")
      .trim() || session.user.email;
  return name
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function BuilderSidebarProfileLink() {
  const [session, setSession] = React.useState<AuthSession | null>(null);

  React.useEffect(() => {
    const s = getAuthSession();
    if (s) setSession(s);
  }, []);

  return (
    <Link
      href="/user"
      className="border-b border-zinc-100 px-7 py-6 block transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-sm font-black tracking-tight text-zinc-900">
          {session ? initialsFor(session) : "SB"}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Shop Builder
          </p>
          <h1 className="text-base font-bold text-zinc-900">Dashboard</h1>
        </div>
      </div>
    </Link>
  );
}

function backToAdminLinkClassName() {
  return "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition hover:bg-zinc-50 focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/10";
}

/**
 * Sits in the same layout slot as the dashboard {@link Sidebar}: left column on
 * large screens, stacked card on small screens. Renders the live theme editor only.
 */
export function BuilderStudioSidebarColumn() {
  return (
    <>
      <div className="p-4 pb-0 lg:hidden">
        <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <BuilderSidebarProfileLink />
          <div className="px-4 py-4">
            <Link
              href={PATHS.adminOverview}
              className={backToAdminLinkClassName()}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Back to admin
            </Link>
          </div>
        </div>
        <div className="max-h-[min(70vh,520px)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white">
          <BuilderEditorSidebar />
        </div>
      </div>

      <aside className="hidden w-[320px] shrink-0 p-6 lg:block">
        <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <BuilderSidebarProfileLink />
          <div className="shrink-0 border-b border-zinc-100 px-6 py-5">
            <Link
              href={PATHS.adminOverview}
              className={backToAdminLinkClassName()}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Back to admin
            </Link>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <BuilderEditorSidebar />
          </div>
        </div>
      </aside>
    </>
  );
}
