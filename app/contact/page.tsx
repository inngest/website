import { redirect } from "next/navigation";

// Permanently redirected to the v1 contact page.
export default function Page() {
  redirect("/contact");
}
