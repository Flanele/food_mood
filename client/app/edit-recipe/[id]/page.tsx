import { EditRecipePage } from "@/screens/edit-recipe";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);

  return <EditRecipePage id={id} />;
}
