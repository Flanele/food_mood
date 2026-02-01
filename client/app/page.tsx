"use client";

import { useSessionKey } from "@/entities/session";
import { AppLoader } from "@/shared/ui/app-loader";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const { isLoading, isError } = useSessionKey();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    router.replace(isError ? "/auth" : "/home");
  }, [isLoading, isError, router]);

  if (isLoading) return <AppLoader />;

  return null;
}
