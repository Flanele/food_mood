"use client";

import { AddIngredientForm, ImageField } from "@/features/forms";
import { FormInput } from "@/features/forms/ui/input-form";
import { FormAddRecipeInput, formAddRecipeSchema } from "@/shared/schemas";
import { Button, Container } from "@/shared/ui";
import { Header } from "@/widgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";


export const AddRecipePage = () => {
  const form = useForm<FormAddRecipeInput>({
    resolver: zodResolver(formAddRecipeSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      ingredients: [{ name: "", unit: "g", amount: "", gramsPerPiece: "" }],
      imageMethod: "url",
      imageUrl: "",
      imageFile: undefined,
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
                  <AddIngredientForm
                    key={field.id}
                    index={index}
                    canRemove={index > 0}
                    onRemove={() => remove(index)}
                    showTooltip={index === 0}
                  />
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

              <ImageField />

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
