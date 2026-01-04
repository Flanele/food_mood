import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import React from "react";
import { AnalyticsByTime } from "./analytics-by-time";
import {
  ProfileAnalyticsTabs,
  useProfileAnalyticsTabChange,
  useProfileAnalyticsTabs,
} from "@/entities/tabs";
import { AnalyticsByIngredients } from "./analytics-by-ingredients";

interface Props {
  className?: string;
}

export const ProfileAnalytics: React.FC<Props> = ({ className }) => {
  const { analyticsTab, setAnalyticsTab } = useProfileAnalyticsTabs();
  const { onChangeAnalyticsTab } =
    useProfileAnalyticsTabChange(setAnalyticsTab);

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      {/* analytics tabs */}
      <ProfileAnalyticsTabs value={analyticsTab} onChange={onChangeAnalyticsTab} />

      {/* content */}
      {analyticsTab === "by-time" && <AnalyticsByTime />}
      {analyticsTab === "by-ingredients" && <AnalyticsByIngredients />}
      {analyticsTab === "nutrients-score" && <div>TODO: Nutrients score</div>}
    </div>
  );
};
