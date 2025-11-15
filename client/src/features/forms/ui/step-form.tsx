import React from "react";
import { FormInput } from "./input-form";
import { ImageField } from "./image-field";
import { useImageField } from "../model/use-image-field";
import { Button } from "@/shared/ui";

interface Props {
  index: number;
  canRemove?: boolean;
  onRemove?: () => void;
}

export const StepForm: React.FC<Props> = ({ index, canRemove, onRemove }) => {
  const prefix = `steps.${index}.image.`;
  const { method, clearAll } = useImageField(prefix);

  const hasAny = Boolean(method);
  const [showImage, setShowImage] = React.useState(hasAny);

  const attachImage = () => {
    setShowImage(true);
  };

  const removeImage = () => {
    clearAll();
    setShowImage(false);
  };

  return (
    <div className="rounded-md border border-secondary p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Step {index + 1}</h4>
        {canRemove && (
          <Button variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <FormInput
        name={`steps.${index}.text`}
        label="Text:"
        required
        placeholder="Describe what to do in this step…"
      />

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-foreground/60">
          You can attach an image to this step (optional).
        </p>

        {!showImage ? (
          <Button type="button" variant="secondary" onClick={attachImage}>
            Attach Image
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={removeImage}>
            Remove Image
          </Button>
        )}
      </div>

      {showImage && <ImageField prefix={prefix} />}
    </div>
  );
};
