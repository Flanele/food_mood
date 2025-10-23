import { ROUTES } from "@/shared";
import { redirect } from "next/navigation";

export default function AuthIndex() {
  redirect(ROUTES.SIGN_IN);
}
