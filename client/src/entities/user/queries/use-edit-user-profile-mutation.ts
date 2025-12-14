import { PatchProfileDTO, PrefsDto } from "@/shared/api/gen";
import { userApi } from "@/shared/api/gen/gen-clients/user";
import { ProfileFormOutput } from "@/shared/schemas/pforile-schema";
import { useMutation } from "@tanstack/react-query";

const editProfileKey = ["edit-profile"];

export const useEditUserProfileMutation = () => {
  return useMutation({
    mutationKey: editProfileKey,
    mutationFn: async (form: ProfileFormOutput) => {
      const prefs: PrefsDto = {
        ...(form.diet != null ? { diet: form.diet } : {}),
        ...(form.allergies != null ? { allergies: form.allergies } : {}),
      };

      const completedPrefs: PrefsDto | null = Object.keys(prefs).length
        ? prefs
        : null;

      const dto: PatchProfileDTO = {
        sex: form.sex ?? undefined,
        birthDate: form.birthDate ?? undefined,
        heightCm: form.heightCm ?? undefined,
        weightKg: form.weightKg ?? undefined,
        prefs: completedPrefs,
      };

      await userApi.userControllerEditProfile(dto);
    },
  });
};
