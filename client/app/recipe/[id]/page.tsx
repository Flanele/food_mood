import { RecipePage } from "@/screens";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);

  return <RecipePage id={id} />;
}
