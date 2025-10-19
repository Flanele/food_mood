import { AuthPage } from "@/pages";
import { Mode } from "@/shared";
import { notFound } from "next/navigation";

export default async function Auth({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (mode !== "sign-in" && mode !== "sign-up") notFound();
  return <AuthPage mode={mode as Mode} />;
}
