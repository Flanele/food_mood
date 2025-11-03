import * as React from "react";

type Props = {
  file?: File;
  onClear: () => void;
  showImage?: boolean;
};

export const FilePreview: React.FC<Props> = ({
  file,
  onClear,
  showImage = true,
}) => {
  if (!file) return null;

  const isImage = String(file.type).startsWith("image/");

  return (
    <div className="mt-3 flex items-center gap-3">
      {showImage && isImage && (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="h-16 w-16 rounded object-cover border"
        />
      )}
      <span className="text-sm">{file.name}</span>
      <button
        type="button"
        className="text-xs underline text-foreground/70 cursor-pointer"
        onClick={onClear}
      >
        clear
      </button>
    </div>
  );
};
