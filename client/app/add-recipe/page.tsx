"use client";

import { useSessionKey } from "@/entities/session";
import { AddRecipePage } from "@/screens";
import { AppLoader } from "@/shared/ui/app-loader";
import { LoadingError } from "@/widgets";

export default function Page() {
  const { isLoading, isError } = useSessionKey();

  if (isLoading) return <AppLoader />;

  if (isError) return <LoadingError isProtected />;

  return <AddRecipePage />;
}
