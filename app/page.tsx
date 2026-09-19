import { redirect } from "next/navigation";

/**
 * The Mehndi lives at its own route so it stays isolated from any other
 * wedding experience added alongside it later.
 */
export default function Home() {
  redirect("/mehndi");
}
