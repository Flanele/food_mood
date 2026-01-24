import { cn } from "@/shared/lib/utils";
import React from "react";
import { Anchor, Content, Portal, Root } from "@radix-ui/react-popover";
import { IngredientSuggestionDto } from "@/shared/api/gen";

interface Props {
  className?: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  suggestions: IngredientSuggestionDto[];
  children: React.ReactNode;
  onSelect: (s: IngredientSuggestionDto) => void;
  searched: boolean;

  isLoading?: boolean;
  isError?: boolean;
}

export const IngredientSuggestionsDropDown: React.FC<Props> = ({
  className,
  open,
  onOpenChange,
  suggestions,
  children,
  onSelect,
  isLoading,
  isError,
  searched,
}) => {
  const showContent = open && (isLoading || isError || searched);

  return (
    <div className={cn(className, "")}>
      <Root open={open} onOpenChange={onOpenChange}>
        <Anchor asChild>
          <div className="inline-block">{children}</div>
        </Anchor>

        {showContent && (
          <Portal>
            <Content
              side="bottom"
              align="start"
              sideOffset={4}
              className="z-50 w-[300px] rounded-md border border-border bg-white shadow-md"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {isLoading && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Searching…
                </div>
              )}

              {isError && (
                <div className="px-3 py-2 text-sm text-destructive">
                  Failed to load suggestions
                </div>
              )}

              {!isLoading &&
                !isError &&
                suggestions.length === 0 &&
                searched && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No matches
                  </div>
                )}

              {!isLoading && !isError && suggestions.length > 0 && (
                <ul className="max-h-60 overflow-auto py-1">
                  {suggestions.map((s) => (
                    <li
                      key={s.externalId}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-secondary"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(s)}
                    >
                      <div className="font-medium">{s.name}</div>
                      {s.dataType && (
                        <div className="text-xs text-gray-400">
                          {s.dataType}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Content>
          </Portal>
        )}
      </Root>
    </div>
  );
};
