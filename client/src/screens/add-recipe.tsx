"use client";

import { UnitSelect } from "@/entities/ingredients";
import { FormInput } from "@/features/forms/ui/input-form";
import { formAddRecipeSchema } from "@/shared/schemas";
import { Button, Container, HelpTooltip } from "@/shared/ui";
import { Header } from "@/widgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

export const AddRecipePage = () => {
  const form = useForm({
    resolver: zodResolver(formAddRecipeSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      ingredients: [{ name: "", unit: "g", amount: "" }],
    },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const titleValue = watch("title");
  const titleLength = titleValue?.length || 0;

  return (
    <>
      <Header mode="other" />
      <Container>
        <div className="mt-10 w-full border-2 border-secondary p-8">
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-8"
              onSubmit={form.handleSubmit(() => {
                /* ok */
              })}
            >
              <div className="flex items-end gap-10">
                <FormInput
                  name="title"
                  label="Title:"
                  required
                  className="w-[75%]"
                />
                <span className="text-black/40">
                  max length: {titleLength}/40
                </span>
              </div>

              <div className="flex flex-col gap-6 pb-4 border-b border-secondary">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-6">
                    <FormInput
                      name={`ingredients.${index}.name`}
                      label="Ingredient:"
                      required
                      placeholder="Sugar"
                      className="w-[300px]"
                    />

                    <UnitSelect
                      name={`ingredients.${index}.unit`}
                      label="Unit:"
                    />

                    <FormInput
                      name={`ingredients.${index}.amount`}
                      label="Amount:"
                      required
                      placeholder="100"
                      className="w-[120px]"
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-8 px-3 h-12 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}

                    {index === 0 && (
                      <div className="mt-10">
                        <HelpTooltip
                          text={`Add ingredients with their quantity and unit (e.g., 100 g of sugar). You can add more items using the '+ Add ingredient' button.

⚠️ **Attention!** If you specify an ingredient in pieces (unit "piece"), you’ll need to provide the weight in grams per piece.

💡 **Also note:** The service uses a third-party API to fetch ingredient data. For better accuracy, please use full and specific ingredient names — for example, instead of "salt", write "salt table ionized", and instead of "milk", use "whole milk".`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => append({ name: "", unit: "g", amount: "" })}
              >
                + Add ingredient
              </Button>

              <Button type="submit" className="bg-primary text-white">
                Submit
              </Button>
            </form>
          </FormProvider>
        </div>
      </Container>
    </>
  );
};
