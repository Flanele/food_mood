interface Props {
  show: boolean;
  notFound: boolean;
  hint: { mode: "selected" | "likely"; ingredient: { name: string } | null };
}

export const IngredientHint: React.FC<Props> = ({ show, notFound, hint }) => {
  if (!show) return null;

  const baseClass =
    "text-xs leading-4 overflow-hidden whitespace-nowrap text-ellipsis";

  if (notFound) {
    return (
      <div className={baseClass}>
        <span className="text-destructive">
          Ingredient does not exist. Please type a correct name.
        </span>
      </div>
    );
  }

  if (!hint.ingredient) return null;

  return (
    <div className={baseClass}>
      <span className="text-muted-foreground">
        {hint.mode === "selected" ? "Selected: " : "Probably means: "}
        <span className="font-medium text-foreground">
          {hint.ingredient.name}
        </span>
      </span>
    </div>
  );
};
