import { ErrorAnimation } from "@/shared/ui";
import { PageShell } from "@/widgets";

export const ForbiddenError = () => {
  return (
    <PageShell mode="other">
      <div className="flex flex-col items-center">
        <ErrorAnimation className="w-[600px] h-[600px]" />
        <p className="text-xl">Access to this page is denied.</p>
      </div>
    </PageShell>
  );
};
