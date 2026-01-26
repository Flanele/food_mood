import React from "react";
import { SimpleLoader } from "@/shared/ui";
import { PageShell } from "./page-shell";

export const LoadingWithHeader: React.FC = () => {
  return (
    <PageShell mode="other">
      <div className="flex flex-col items-center">
        <SimpleLoader className="w-[600px] h-[600px]" />
        <p className="text-xl">Loading...</p>
      </div>
    </PageShell>
  );
};
