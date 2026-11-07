import { redirect } from "next/navigation";
import StudioPage from "./studio/page";

export default function Home() {
  // Native Capacitor builds start directly in the app at /.
  // The desktop website keeps its existing / -> /studio redirect.
  if (process.env.FILMOOD_NATIVE === "1") {
    return <StudioPage />;
  }
  redirect("/studio");
}
