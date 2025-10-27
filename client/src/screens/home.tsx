"use client";

import { useRecipeList } from "@/features/recipes/recipe-list";
import { RecipeListQuery } from "@/shared";
import { Container, Input, Title } from "@/shared/ui";
import {
  FiltersBar,
  Header,
  NotFoundError,
  Pagination,
  RecipeCatalog,
} from "@/widgets";
import React from "react";

export const HomePage = () => {
  const {
    data,
    query,
    setQuery,
    currentPage,
    totalPages,
    onPageChange,
    isFetching,
    isLoading,
    error,
  } = useRecipeList();

  return (
    <>
      <Header mode="home" />
      <Container>
        <div className="flex flex-col min-h-screen">
          <div className="flex mt-12 p-2 mb-10">
            <Title size="lg" text="All recipes" className="font-quantico" />
            <Input
              placeholder="Search recipe..."
              className="max-w-[50%] self-center rounded-[22px] mx-auto bg-primary/10 border-primary/20 placeholder:text-lg !text-lg"
              onChange={(e) =>
                setQuery((prev: RecipeListQuery) => ({
                  ...prev,
                  page: 1,
                  q: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex gap-20 flex-1">
            <div className="pl-1 w-[250px] shrink-0">
              <Title size="md" text="Filters:" className="mb-4 mt-4" />
              <FiltersBar
                className="w-[250px]"
                value={query}
                onChange={setQuery}
              />
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
                <div className="flex flex-col flex-1">
                  <RecipeCatalog
                    recipes={data?.recipes}
                    isLoading={isLoading || isFetching}
                  />

                  <Pagination
                    className="justify-center mt-auto mb-10"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}

                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};