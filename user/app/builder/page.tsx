import { redirect } from "next/navigation";

import { PATHS } from "@/lib/site-paths";

export default function BuilderRootRedirect() {
  redirect(PATHS.builderUpdate);
}
