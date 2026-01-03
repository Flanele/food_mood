import React from "react";
import { Button } from "@/shared/ui";
import { ProfileTab } from "../model/use-profile-tabs";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
  value: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export const ProfileTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-5")}>
      <Button
        type="button"
        variant={value === "form" ? "secondary" : "ghost"}
        onClick={() => onChange("form")}
      >
        Profile
      </Button>

      <Button
        type="button"
        variant={value === "recipes" ? "secondary" : "ghost"}
        onClick={() => onChange("recipes")}
      >
        My recipes
      </Button>

      <Button
        type="button"
        variant={value === "logs" ? "secondary" : "ghost"}
        onClick={() => onChange("logs")}
      >
        My meal logs
      </Button>

      <Button
        type="button"
        variant={value === "analytics" ? "secondary" : "ghost"}
        onClick={() => onChange("analytics")}
      >
        My analytics
      </Button>
    </div>
  );
};
