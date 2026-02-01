"use client";

import React from "react";
import { useEditRecipeForm } from "../model/use-edit-recipe-form";
import { FormProvider } from "react-hook-form";
import { FormInput } from "./input-form";
import { AddIngredientForm } from "./add-ingredient-form";
import { Button } from "@/shared/ui";
import { ImageField } from "./image-field";
import { StepForm } from "./step-form";

interface Props {
  id: number;
}

export const EditRecipeForm: React.FC<Props> = ({ id }) => {
  const {
    form,
    titleLength,
    ingredientFields,
    appendIngredient,
    removeIngredient,
    stepFields,
    appendStep,
    removeStep,

    handleSubmit,
    isLoading,
    isError,
  } = useEditRecipeForm(id);

  return (
    <div className="mt-10 w-full border-2 border-secondary p-8">
      <FormProvider {...form}>
        <form className="flex flex-col gap-8">
          <div className="flex items-end gap-10">
            <FormInput
              name="title"
              label="Title:"
              required
              className="w-[75%]"
            />
            <span className="text-black/40">max length: {titleLength}/40</span>
          </div>

          <FormInput
            name="servings"
            label="Servings:"
            required
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            className="w-[120px]"
          />

          <div className="flex flex-col gap-6 pb-4 border-b border-secondary">
            {ingredientFields.map((field, index) => (
              <AddIngredientForm
                key={field.id}
                index={index}
                canRemove={index > 0}
                onRemove={() => removeIngredient(index)}
                showTooltip={index === 0}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() =>
              appendIngredient({ name: "", unit: "g", amount: undefined })
            }
          >
            + Add ingredient
          </Button>

          <ImageField />

          <div className="flex flex-col gap-6">
            {stepFields.map((field, index) => (
              <StepForm
                key={field.id}
                index={index}
                canRemove={index >= 2}
                onRemove={() => removeStep(index)}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() =>
                appendStep({
                  text: "",
                  image: {
                    imageMethod: undefined,
                    imageUrl: undefined,
                    imageFile: undefined,
                  },
                })
              }
            >
              + Add step
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="bg-primary"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>

            {isError && (
              <span className="text-red-500 text-sm">
                Something went wrong. Please try again.
              </span>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
