import { redirect } from "next/navigation";

/** Checkout happens inside the preview on `/builder`. */
export default function BuilderCheckoutRedirectPage() {
  redirect("/builder");
}
