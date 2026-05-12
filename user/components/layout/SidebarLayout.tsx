"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/ui/scroll-area"
import { Separator } from "@/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/ui/sidebar"

export function SidebarLayout({
  title = "Editor",
  sidebar,
  children,
  className,
  contentClassName,
}: {
  title?: string
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                Shop Builder
              </p>
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{title}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">{sidebar}</ScrollArea>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className={cn("min-h-svh", className)}>
        {/* Toggle lives immediately after the sidebar */}
        <div className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-border bg-background px-3">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mx-1 h-5" orientation="vertical" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
          </div>
        </div>

        <ScrollArea className={cn("h-[calc(100svh-3rem)]", contentClassName)}>
          <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            {/* Editor surface */}
            <div className="rounded-xl border border-border bg-white shadow-sm">
              {children}
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}

