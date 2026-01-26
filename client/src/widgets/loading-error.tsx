import React from "react";
import { ErrorAnimation } from "@/shared/ui";
import Link from "next/link";
import { ROUTES } from "@/shared";
import { PageShell } from "./page-shell";

interface Props {
  isProtected?: boolean;
}

export const LoadingError: React.FC<Props> = ({ isProtected }) => {
  return (
    <PageShell mode="other">
      <div className="flex flex-col items-center">
        <ErrorAnimation className="w-[600px] h-[600px]" />
        <p className="text-xl">We encountered an error loading this page.</p>

        {isProtected && (
          <p className="text-xl">
            To view this page, please{" "}
            <Link
              href={ROUTES.AUTH}
              className="corsor-pointer underline text-primary"
            >
              log in
            </Link>{" "}
            first.
          </p>
        )}
      </div>
    </PageShell>
  );
};
