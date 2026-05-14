"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BuilderEditorSidebar } from "@/components/builder-studio/builder-editor-sidebar";
import { PATHS } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

function backToAdminLinkClassName() {
  return "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950";
}

/**
 * Sits in the same layout slot as the dashboard {@link Sidebar}: left column on
 * large screens, stacked card on small screens. Renders the live theme editor only.
 */
export function BuilderStudioSidebarColumn() {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div
        className={cn(
          "p-4 pb-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 lg:hidden",
          entered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <div className="mb-3 rounded-[2rem] bg-white px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <Link
            href={PATHS.adminOverview}
            className={backToAdminLinkClassName()}
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Back to admin
          </Link>
        </div>
        <div className="max-h-[min(70vh,520px)] overflow-y-auto rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <BuilderEditorSidebar />
        </div>
      </div>

      <aside className="hidden w-[292px] shrink-0 p-5 lg:block">
        <div
          className={cn(
            "sticky top-5 flex h-[calc(100vh-2.5rem)] max-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.07)] transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100",
            entered ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
          )}
        >
          <div className="shrink-0 border-b border-slate-100 p-3">
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
