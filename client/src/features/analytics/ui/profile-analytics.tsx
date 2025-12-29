import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import React from "react";
import { useProfileAnalytics } from "../model/use-profile-analytics";

interface Props {
  className?: string;
}

export const ProfileAnalytics: React.FC<Props> = ({ className }) => {
  const { safeAnalyticsTab, setAnalyticsTab } = useProfileAnalytics();

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      {/* analytics tabs */}
      <div className="flex flex-wrap gap-5">
        <Button
          type="button"
          variant={safeAnalyticsTab === "by-time" ? "secondary" : "ghost"}
          onClick={() => setAnalyticsTab("by-time")}
        >
          By time
        </Button>

        <Button
          type="button"
          variant={
            safeAnalyticsTab === "by-ingredients" ? "secondary" : "ghost"
          }
          onClick={() => setAnalyticsTab("by-ingredients")}
        >
          By ingredients
        </Button>

        <Button
          type="button"
          variant={
            safeAnalyticsTab === "nutrients-score" ? "secondary" : "ghost"
          }
          onClick={() => setAnalyticsTab("nutrients-score")}
        >
          Nutrients score
        </Button>
      </div>

      {/* content placeholder */}
      {safeAnalyticsTab === "by-time" && <div>TODO: Analytics by time</div>}
      {safeAnalyticsTab === "by-ingredients" && (
        <div>TODO: Analytics by ingredients</div>
      )}
      {safeAnalyticsTab === "nutrients-score" && (
        <div>TODO: Nutrients score</div>
      )}
    </div>
  );
};
