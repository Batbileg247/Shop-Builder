import { redirect } from "next/navigation";

/** Old URL; shop lives on `/builder`. */
export default function BuilderCatalogRedirectPage() {
  redirect("/builder");
}
