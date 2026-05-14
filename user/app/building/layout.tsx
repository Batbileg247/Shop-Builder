import { BuilderRouteShell } from "@/components/builder-studio/builder-route-shell";

export default function BuildingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BuilderRouteShell>{children}</BuilderRouteShell>;
}
