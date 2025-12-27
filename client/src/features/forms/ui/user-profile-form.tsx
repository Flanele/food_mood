import { ProfileDTO } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { FormProvider } from "react-hook-form";
import { FormInput } from "./input-form";
import { Button } from "@/shared/ui";
import { DietSelect, SexSelect } from "@/entities/profile";
import { useEditProfileForm } from "../model/use-edit-profile-form";

interface Props {
  className?: string;
  profile: ProfileDTO;
}

export const UserProfileForm: React.FC<Props> = ({ className, profile }) => {
  const {
    form,
    handleSubmit,
    allergies,
    setValue,
    isSubmitting,
    formErrors,
    isError,
  } = useEditProfileForm(profile);

  return (
    <div
      className={cn("w-full border-2 border-secondary p-8", className)}
    >
      <FormProvider {...form}>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Sex */}
          <SexSelect name="sex" label="Sex:" />

          {/* Birth date */}
          <FormInput
            name="birthDate"
            label="Birth date:"
            type="date"
            className="w-[250px]"
          />

          <div className="flex gap-6">
            {/* Height */}
            <FormInput
              name="heightCm"
              label="Height (cm):"
              type="number"
              inputMode="numeric"
              className="w-[180px]"
            />

            {/* Weight */}
            <FormInput
              name="weightKg"
              label="Weight (kg):"
              type="number"
              inputMode="decimal"
              step="0.5"
              className="w-[180px]"
            />
          </div>

          {/* Diet */}
          <DietSelect name="diet" label="Diet:" />

          {/* Allergies */}
          <div className="flex flex-col gap-2">
            <span>Allergies:</span>

            <div className="flex flex-col gap-3">
              {allergies?.map((_, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <FormInput
                    name={`allergies.${index}`}
                    className="w-[280px]"
                    placeholder="type allergy"
                  />

                  {allergies.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-red-500 underline cursor-pointer"
                      onClick={() => {
                        const next = allergies.filter((_, i) => i !== index);
                        setValue("allergies", next.length ? next : undefined);
                      }}
                    >
                      remove
                    </button>
                  )}
                </div>
              ))}

              {formErrors.allergies?.root && (
                <span className="text-xs text-red-500">
                  {formErrors.allergies.root.message as string}
                </span>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() =>
                  setValue("allergies", [...(allergies ?? []), ""], {
                    shouldValidate: false,
                  })
                }
              >
                + Add allergy
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              type="submit"
              className="bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save profile"}
            </Button>

            {isError && <span className="text-red-500">Something went wrong...</span>}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
