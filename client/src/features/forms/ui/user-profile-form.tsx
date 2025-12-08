import { ProfileDTO } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import {
  formProfileSchema,
  ProfileFormInput,
} from "@/shared/schemas/pforile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "./input-form";
import { Button, Select } from "@/shared/ui";
import { DietSelect, SexSelect } from "@/entities/profile";

interface Props {
  className?: string;
  profile: ProfileDTO;
}

type PrefsForForm = {
  diet?: ProfileFormInput["diet"];
  allergies?: ProfileFormInput["allergies"];
};

export const UserProfileForm: React.FC<Props> = ({ className, profile }) => {
  const prefs = (profile.prefs ?? {}) as PrefsForForm;

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      sex: profile.sex ?? undefined,
      birthDate: profile.birthDate
        ? new Date(profile.birthDate as unknown as string)
            .toISOString()
            .slice(0, 10)
        : undefined,
      heightCm: profile.heightCm ?? undefined,
      weightKg: profile.weightKg ?? undefined,
      diet: prefs.diet ?? null,
      allergies: prefs.allergies ?? null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const allergies = watch("allergies") ?? [];

  return (
    <div
      className={cn("mt-10 w-full border-2 border-secondary p-8", className)}
    >
      <FormProvider {...form}>
        <form className="flex flex-col gap-8" onSubmit={() => {}}>
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
              inputMode="numeric"
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

                  <button
                    type="button"
                    className="text-xs text-red-500 underline cursor-pointer"
                    onClick={() => {
                      const next = allergies.filter((_, i) => i !== index);
                      setValue("allergies", next, { shouldValidate: true });
                    }}
                  >
                    remove
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() =>
                  setValue("allergies", [...allergies, ""], {
                    shouldValidate: true,
                  })
                }
              >
                + Add allergy
              </Button>

              {errors.allergies && (
                <span className="text-xs text-red-500">
                  {errors.allergies.message as string}
                </span>
              )}
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
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
