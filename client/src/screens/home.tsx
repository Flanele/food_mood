"use client";

import { useRecipeList } from "@/entities/recipe-list";
import { RecipeCard } from "@/entities/recipe/ui/recipe-card";
import { useDebouncedValue } from "@/features/debounce";
import { RecipeListQuery } from "@/shared";
import { Container, Input, Title } from "@/shared/ui";
import { FiltersBar, Header } from "@/widgets";
import React from "react";

export const HomePage = () => {
  const [query, setQuery] = React.useState<RecipeListQuery>({
    page: 1,
    limit: 20,
    filters: {},
  });

  const debouncedQuery = useDebouncedValue(query, 500);
  const { data, isLoading, error, isFetching } = useRecipeList({
    query: debouncedQuery,
  });

  console.log(data);

  return (
    <>
      <Header mode="home" />
      <Container>
        <div className="flex mt-16 p-2 mb-10">
          <Title size="lg" text="All recipes" className="font-quantico" />
          <Input
            placeholder="Search recipe..."
            className="max-w-[50%] self-center rounded-[22px] mx-auto bg-primary/10 border-primary/20 placeholder:text-lg !text-lg"
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, page: 1, q: e.target.value }))
            }
          />
        </div>

        <div className="flex gap-20">
          <div className="pl-1">
            <Title size="md" text="Filters:" className="mb-4 mt-4" />
            <FiltersBar
              className="w-[250px]"
              value={query}
              onChange={setQuery}
            />
          </div>

          <div className="flex flex-wrap gap-8">
            {data?.recipes.map((r) => (
              <RecipeCard
                key={r.id}
                title={r.title}
                pictureUrl={r.picture_url}
                kcalPerServ={r.kcalPerServ}
                protPerServ={r.protPerServ}
                fatPerServ={r.fatPerServ}
                carbPerServ={r.carbPerServ}
                sugarPerServ={r.sugarPerServ}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};
