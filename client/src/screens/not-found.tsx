import { ErrorAnimation } from "@/shared/ui";
import { PageShell } from "@/widgets";

export const NotFoundPage = () => {
  return (
    <PageShell mode="other">
      <div className="flex flex-col items-center">
        <ErrorAnimation className="w-[600px] h-[600px]" />
        <p className="text-xl">
          Oops! This page appears to no longer exist or has been deleted...
        </p>
      </div>
    </PageShell>
  );
};
