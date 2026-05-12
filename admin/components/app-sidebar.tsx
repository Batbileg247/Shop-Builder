"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Store,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/merchants", label: "Merchants", icon: Users },
  { href: "/stores", label: "Stores", icon: Store },
  { href: "/products", label: "Products", icon: Package },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const menuButtonClass =
  "h-9 gap-2.5 rounded-xl px-2.5 text-[13px] font-medium tracking-tight text-neutral-600 shadow-none " +
  "hover:bg-neutral-100/90 hover:text-neutral-900 " +
  "data-[active=true]:bg-[#111827] data-[active=true]:text-white data-[active=true]:shadow-none " +
  "data-[active=true]:hover:bg-[#111827] data-[active=true]:hover:text-white " +
  "[&>svg]:size-[18px] [&>svg]:shrink-0 [&>svg]:text-neutral-500 " +
  "data-[active=true]:[&>svg]:text-white";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className={cn(
        "border-r border-neutral-200/90 bg-transparent",
        "[&_[data-slot=sidebar-inner]]:bg-white",
      )}
    >
      <SidebarHeader className="border-b border-neutral-200/90 px-3 py-3">
        <div className="flex flex-col gap-0.5 px-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Admin
          </span>
          <span className="text-[15px] font-semibold leading-tight tracking-tight text-neutral-900">
            Platform
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1.5 pt-2">
        <SidebarGroup className="p-0 px-0.5">
          <SidebarGroupContent className="text-[13px]">
            <SidebarMenu className="gap-0.5">
              {nav.map(({ href, label, icon: Icon }) => {
                const active = isActiveRoute(pathname, href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={menuButtonClass}
                    >
                      <Link href={href}>
                        <Icon aria-hidden />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
