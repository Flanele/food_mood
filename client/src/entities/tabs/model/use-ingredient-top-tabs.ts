import { Orientation } from "@/shared";
import { parseAsString, useQueryState } from "nuqs";

export type IngredientTopTab = "top-10" | "top-20";

const topTabs: IngredientTopTab[] = ["top-10", "top-20"];

export const useIngredientTopTabs = () => {
  const [topRaw, setTopRaw] = useQueryState(
    "ingredientTop",
    parseAsString.withDefault("top-10")
  );

  const top: IngredientTopTab = topTabs.includes(topRaw as IngredientTopTab)
    ? (topRaw as IngredientTopTab)
    : "top-10";

  const setTop = (t: IngredientTopTab) => setTopRaw(t);

  const limit = top === "top-20" ? 20 : 10;
  const orientation: Orientation = top === "top-20" ? "horizontal" : "vertical";

  return { top, setTop, limit, orientation };
};
