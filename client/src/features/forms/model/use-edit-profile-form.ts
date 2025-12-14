import { useEditUserProfileMutation } from "@/entities/user";
import { ProfileDTO } from "@/shared/api/gen";
import {
  formProfileSchema,
  ProfileFormInput,
  ProfileFormOutput,
} from "@/shared/schemas/pforile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type PrefsForForm = {
  diet?: ProfileFormInput["diet"];
  allergies?: ProfileFormInput["allergies"];
};

export const useEditProfileForm = (profile: ProfileDTO) => {
  const prefs = (profile.prefs ?? {}) as PrefsForForm;
  const editProfile = useEditUserProfileMutation();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(formProfileSchema),
    mode: "onChange",
    defaultValues: {
      sex: profile.sex ?? null,
      birthDate: profile.birthDate
        ? new Date(profile.birthDate as unknown as string)
            .toISOString()
            .slice(0, 10)
        : null,
      heightCm: profile.heightCm ?? null,
      weightKg: profile.weightKg ?? null,
      diet: prefs.diet ?? null,
      allergies: (prefs.allergies as string[] | null) ?? null,
    },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const allergies = watch("allergies");

  return {
    form,
    handleSubmit: form.handleSubmit((data) =>
      editProfile.mutate(data as ProfileFormOutput)
    ),
    setValue,
    allergies,
    isSubmitting: editProfile.isPending,
    formErrors: errors,
    isError: editProfile.isError
  };
};
