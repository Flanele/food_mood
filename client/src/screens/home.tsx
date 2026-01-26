"use client";

import {
  useRecipeList,
  useRecipeListFilters,
} from "@/features/recipes/recipe-list";
import { ROUTES } from "@/shared";
import { Button, Input, Title } from "@/shared/ui";
import {
  FiltersBar,
  NotFoundError,
  PageShell,
  Pagination,
  RecipeCatalog,
} from "@/widgets";
import Link from "next/link";
import React from "react";

export const HomePage = () => {
  const {
    data,
    currentPage,
    totalPages,
    onPageChange,
    isFetching,
    isLoading,
    error,
  } = useRecipeList();

  const filters = useRecipeListFilters();

  return (
    <PageShell mode="home">
      <div className="flex flex-col min-h-screen">
        <div className="flex mt-12 p-2 mb-10">
          <Title size="lg" text="All recipes" className="font-quantico" />
          <Input
            placeholder="Search recipe..."
            className="max-w-[50%] self-center rounded-[22px] mx-auto bg-primary/10 border-primary/20 placeholder:text-lg !text-lg"
            onChange={(e) => {
              filters.setPage(1);
              filters.setQ(e.target.value);
            }}
          />
          <Button asChild variant="outline">
            <Link href={ROUTES.ADD_RECIPE}>Add recipe</Link>
          </Button>
        </div>

        <div className="flex gap-20 flex-1">
          <div className="pl-1 w-[250px] shrink-0">
            <Title size="md" text="Filters:" className="mb-4 mt-4" />
            <FiltersBar className="w-[250px]" />
          </div>

          <div className="flex flex-col flex-1">
            {error ? (
              <div className="flex w-full flex-1 justify-center items-center">
                <NotFoundError
                  text="Something went wrong..."
                  animatiomClassName="w-[320px] h-[320px]"
                />
              </div>
            ) : (
              <div className="flex flex-col flex-1 mb-10">
                <RecipeCatalog
                  recipes={data?.recipes}
                  isLoading={isLoading || isFetching}
                />

                <Pagination
                  className="justify-center mt-auto"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};
