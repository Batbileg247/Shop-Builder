import { redirect } from "next/navigation";

export default function BuilderCartRedirectPage() {
  redirect("/builder?cart=open");
}
