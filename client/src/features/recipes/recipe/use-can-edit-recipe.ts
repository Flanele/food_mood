import { useMyProfileId } from "@/features/profile";
import { useRecipePage } from "./use-recipe-page";

export const useCanEditRecipe = (id: number) => {
  const {
    recipe,
    isLoading: isRecipeLoading,
    isError: isRecipeError,
    isNotFound,
  } = useRecipePage(id);
  const {
    myProfileId,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useMyProfileId();

  const authorProfileId = recipe?.authorProfileId as unknown as number;

  const canEdit = authorProfileId === myProfileId;

  return {
    isLoading: isRecipeLoading || isProfileLoading,
    isError: isRecipeError || isProfileError,
    isNotFound,
    canEdit,
  };
};
