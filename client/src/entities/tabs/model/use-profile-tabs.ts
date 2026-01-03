import { parseAsString, useQueryState } from "nuqs";

export type ProfileTab = "form" | "recipes" | "logs" | "analytics";

const profileTabs: ProfileTab[] = ["form", "recipes", "logs", "analytics"];

export const useProfileTabs = () => {
  const [tabRaw, setTabRaw] = useQueryState(
    "tab",
    parseAsString.withDefault("form")
  );

  const tab: ProfileTab = profileTabs.includes(tabRaw as ProfileTab)
    ? (tabRaw as ProfileTab)
    : "form";

  const setTab = (t: ProfileTab) => setTabRaw(t);

  return { tab, setTab };
};
